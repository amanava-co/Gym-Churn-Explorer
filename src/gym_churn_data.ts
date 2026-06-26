export interface GymMember {
  gender: number; // 0 or 1
  Near_Location: number; // 0 or 1
  Partner: number; // 0 or 1
  Promo_friends: number; // 0 or 1
  Phone: number; // 0 or 1
  Contract_period: number; // 1, 6 or 12
  Group_visits: number; // 0 or 1
  Age: number;
  Avg_additional_charges_total: number;
  Month_to_end_contract: number;
  Lifetime: number;
  Avg_class_frequency_total: number;
  Avg_class_frequency_current_month: number;
  Churn: number; // 0 or 1
}

// @ts-ignore
import csvContent from "../gym_churn_us.csv?raw";

function parseCsv(csv: string): number[][] {
  const lines = csv.trim().split("\n");
  const dataLines = lines.slice(1).filter(l => l.trim().length > 0);
  return dataLines.map(line => {
    return line.split(",").map(val => {
      const parsed = parseFloat(val.trim());
      return isNaN(parsed) ? 0 : parsed;
    });
  });
}

export const gymMembersRawData: number[][] = parseCsv(csvContent);

// Helper to fully convert values to structured GymMember objects
export function getGymMembers(): GymMember[] {
  return gymMembersRawData.map((row) => ({
    gender: row[0],
    Near_Location: row[1],
    Partner: row[2],
    Promo_friends: row[3],
    Phone: row[4],
    Contract_period: row[5],
    Group_visits: row[6],
    Age: row[7],
    Avg_additional_charges_total: row[8],
    Month_to_end_contract: row[9],
    Lifetime: row[10],
    Avg_class_frequency_total: row[11],
    Avg_class_frequency_current_month: row[12],
    Churn: row[13]
  }));
}

// Compute dynamic summaries (equivalent to pandas describe() and median())
export interface DescriptiveStatistics {
  count: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  std: number;
}

export function computeStatistics(members: GymMember[], key: keyof GymMember): DescriptiveStatistics {
  const values = members.map(m => m[key]).sort((a, b) => a - b);
  const count = values.length;
  if (count === 0) {
    return { count: 0, mean: 0, median: 0, min: 0, max: 0, std: 0 };
  }

  const sum = values.reduce((acc, v) => acc + v, 0);
  const mean = sum / count;

  const min = values[0];
  const max = values[count - 1];

  let median = 0;
  const mid = Math.floor(count / 2);
  if (count % 2 === 0) {
    median = (values[mid - 1] + values[mid]) / 2;
  } else {
    median = values[mid];
  }

  const squareDiffs = values.map(v => Math.pow(v - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((acc, v) => acc + v, 0) / count;
  const std = Math.sqrt(avgSquareDiff);

  return { count, mean, median, min, max, std };
}

// Compute Pearson correlation matrix dynamically
export function computeCorrelationMatrix(members: GymMember[], fields: (keyof GymMember)[]): number[][] {
  const n = members.length;
  const matrix: number[][] = [];

  for (let i = 0; i < fields.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < fields.length; j++) {
      if (i === j) {
        matrix[i][j] = 1.0;
        continue;
      }
      const f1 = fields[i];
      const f2 = fields[j];

      const x = members.map(m => m[f1]);
      const y = members.map(m => m[f2]);

      const meanX = x.reduce((acc, v) => acc + v, 0) / n;
      const meanY = y.reduce((acc, v) => acc + v, 0) / n;

      let num = 0;
      let denX = 0;
      let denY = 0;

      for (let k = 0; k < n; k++) {
        const diffX = x[k] - meanX;
        const diffY = y[k] - meanY;
        num += diffX * diffY;
        denX += diffX * diffX;
        denY += diffY * diffY;
      }

      const r = denX === 0 || denY === 0 ? 0 : num / Math.sqrt(denX * denY);
      matrix[i][j] = parseFloat(r.toFixed(4));
    }
  }

  return matrix;
}

// --- Dynamic Logistic Regression Class implemented in client-side TypeScript ---
export class LogisticRegression {
  private weights: number[] = [];
  private bias: number = 0;
  private means: number[] = [];
  private stds: number[] = [];
  private features: (keyof GymMember)[] = [];

  constructor(features: (keyof GymMember)[]) {
    this.features = features;
  }

  private sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-z));
  }

  public train(members: GymMember[], epochs: number = 150, alpha: number = 0.1) {
    const X: number[][] = [];
    const Y: number[] = [];

    // Parse features
    for (const m of members) {
      const row: number[] = [];
      for (const f of this.features) {
        row.push(m[f]);
      }
      X.push(row);
      Y.push(m.Churn);
    }

    const nSamples = X.length;
    const nFeatures = this.features.length;

    // Feature normalization (vital for gradient descent stability)
    this.means = Array(nFeatures).fill(0);
    this.stds = Array(nFeatures).fill(0);

    for (let j = 0; j < nFeatures; j++) {
      let sum = 0;
      for (let i = 0; i < nSamples; i++) sum += X[i][j];
      const mean = sum / nSamples;
      this.means[j] = mean;

      let varianceSum = 0;
      for (let i = 0; i < nSamples; i++) varianceSum += Math.pow(X[i][j] - mean, 2);
      const std = Math.sqrt(varianceSum / nSamples) || 1.0;
      this.stds[j] = std;

      for (let i = 0; i < nSamples; i++) {
        X[i][j] = (X[i][j] - mean) / std;
      }
    }

    // Initialize weights and bias
    this.weights = Array(nFeatures).fill(0);
    this.bias = 0;

    // Gradient descent
    for (let epoch = 0; epoch < epochs; epoch++) {
      const predictions: number[] = [];
      for (let i = 0; i < nSamples; i++) {
        let z = this.bias;
        for (let j = 0; j < nFeatures; j++) {
          z += X[i][j] * this.weights[j];
        }
        predictions.push(this.sigmoid(z));
      }

      // Calculate gradients
      const dw = Array(nFeatures).fill(0);
      let db = 0;

      for (let i = 0; i < nSamples; i++) {
        const diff = predictions[i] - Y[i];
        for (let j = 0; j < nFeatures; j++) {
          dw[j] += diff * X[i][j];
        }
        db += diff;
      }

      // Update parameters
      for (let j = 0; j < nFeatures; j++) {
        this.weights[j] -= (alpha * dw[j]) / nSamples;
      }
      this.bias -= (alpha * db) / nSamples;
    }
  }

  public predict(member: Partial<GymMember>): number {
    let z = this.bias;
    for (let j = 0; j < this.features.length; j++) {
      const f = this.features[j];
      const val = member[f] !== undefined ? (member[f] as number) : 0;
      // Normalize
      const normVal = (val - this.means[j]) / this.stds[j];
      z += normVal * this.weights[j];
    }
    return this.sigmoid(z);
  }

  public explain(member: Partial<GymMember>): { baseValue: number; expectedValue: number; shapValues: { feature: string; value: number; originalValue: number; impact: 'positive' | 'negative' }[] } {
    let z = this.bias;
    const shapValues = [];

    for (let j = 0; j < this.features.length; j++) {
      const f = this.features[j];
      const val = member[f] !== undefined ? (member[f] as number) : 0;
      const normVal = (val - this.means[j]) / this.stds[j];
      const shapValue = normVal * this.weights[j];
      z += shapValue;

      shapValues.push({
        feature: f,
        value: shapValue,
        originalValue: val,
        impact: shapValue > 0 ? 'positive' : 'negative'
      });
    }

    // Sort by absolute impact (descending)
    shapValues.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

    return {
      baseValue: this.bias,
      expectedValue: z,
      // @ts-ignore
      shapValues
    };
  }
}

// Pre-create and train the predictor helper
export function getTrainedPredictor(): LogisticRegression {
  const features: (keyof GymMember)[] = [
    "gender",
    "Near_Location",
    "Partner",
    "Promo_friends",
    "Phone",
    "Contract_period",
    "Group_visits",
    "Age",
    "Avg_additional_charges_total",
    "Month_to_end_contract",
    "Lifetime",
    "Avg_class_frequency_total",
    "Avg_class_frequency_current_month"
  ];
  const model = new LogisticRegression(features);
  const data = getGymMembers();
  model.train(data, 200, 0.15);
  return model;
}

// Convert gymMembersRawData back into CSV string in case user downloads it
export function getCSVString(members: GymMember[]): string {
  const header = "gender,Near_Location,Partner,Promo_friends,Phone,Contract_period,Group_visits,Age,Avg_additional_charges_total,Month_to_end_contract,Lifetime,Avg_class_frequency_total,Avg_class_frequency_current_month,Churn\n";
  const rows = members.map(m => 
    `${m.gender},${m.Near_Location},${m.Partner},${m.Promo_friends},${m.Phone},${m.Contract_period},${m.Group_visits},${m.Age},${m.Avg_additional_charges_total},${m.Month_to_end_contract},${m.Lifetime},${m.Avg_class_frequency_total},${m.Avg_class_frequency_current_month},${m.Churn}`
  ).join("\n");
  return header + rows;
}
