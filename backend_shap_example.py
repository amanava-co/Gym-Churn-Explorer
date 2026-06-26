import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
import shap
import pandas as pd
import numpy as np
import pickle

app = FastAPI(title="SHAP API para Simulador Predictor IA")

# ---------------------------------------------------------
# Mocking modelo para exemplo (substitua pelo seu modelo real)
# Ex: model = pickle.load(open('modelo_churn.pkl', 'rb'))
# ---------------------------------------------------------
class MockModel:
    def predict_proba(self, X):
        return np.array([[0.3, 0.7]] * len(X))
model = MockModel()

# Criando um explainer SHAP (TreeExplainer para Random Forest/XGBoost, KernelExplainer para outros)
# explainer = shap.TreeExplainer(model)
# Para o exemplo, vamos mockar os valores SHAP também.

class PredicaoInput(BaseModel):
    gender: int
    Near_Location: int
    Partner: int
    Promo_friends: int
    Phone: int
    Contract_period: int
    Group_visits: int
    Age: int
    Avg_additional_charges_total: float
    Month_to_end_contract: int
    Lifetime: int
    Avg_class_frequency_total: float
    Avg_class_frequency_current_month: float


@app.post("/api/predict")
def predict_and_explain(data: PredicaoInput):
    # 1. Converter input para DataFrame
    df = pd.DataFrame([data.dict()])
    
    # 2. Fazer predição (probabilidade da classe 1 - Churn)
    prob_churn = float(model.predict_proba(df)[0][1])
    
    # 3. Calcular valores SHAP locais
    # shap_values = explainer.shap_values(df)
    # mockando valores SHAP para o exemplo (retorna dict com impacto de cada variável)
    
    base_value = 0.35 # probabilidade base do modelo
    
    # Simulando alguns valores explicativos
    shap_data = [
        {"feature": "Age", "value": -0.05, "originalValue": data.Age, "impact": "negative"},
        {"feature": "Lifetime", "value": -0.10, "originalValue": data.Lifetime, "impact": "negative"},
        {"feature": "Contract_period", "value": -0.08, "originalValue": data.Contract_period, "impact": "negative"},
        {"feature": "Avg_class_frequency_current_month", "value": 0.15, "originalValue": data.Avg_class_frequency_current_month, "impact": "positive"},
        {"feature": "Group_visits", "value": 0.03, "originalValue": data.Group_visits, "impact": "positive"}
    ]
    
    # Ordenar por maior impacto absoluto
    shap_data.sort(key=lambda x: abs(x["value"]), reverse=True)
    
    # 4. Gerar resumo dinâmico (Top 3)
    resumo = gerar_resumo_dinamico(shap_data)
    
    return {
        "predicao": prob_churn,
        "shap": {
            "baseValue": base_value,
            "shapValues": shap_data
        },
        "resumo_dinamico": resumo
    }

def gerar_resumo_dinamico(shap_data):
    if not shap_data:
        return ""
        
    top3 = shap_data[:3]
    
    def texto_impacto(impacto):
        return "elevou o risco de churn" if impacto == "positive" else "reduziu o risco de churn"
        
    resumo = (
        f'A predição foi mais influenciada pela variável "{top3[0]["feature"]}" '
        f'(valor: {top3[0]["originalValue"]}), que {texto_impacto(top3[0]["impact"])}. '
    )
    
    if len(top3) > 1:
        txt2 = "aumentou" if top3[1]["impact"] == "positive" else "diminuiu"
        resumo += f'Em seguida, a variável "{top3[1]["feature"]}" {txt2} a probabilidade. '
        
    if len(top3) > 2:
        txt3 = "positivo (aumentando o risco)" if top3[2]["impact"] == "positive" else "negativo (retendo o cliente)"
        resumo += f'Por fim, "{top3[2]["feature"]}" também teve impacto {txt3}.'
        
    return resumo

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
