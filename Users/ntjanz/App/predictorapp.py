import gradio as gr
import pandas as pd
import joblib
import matplotlib.pyplot as plt

# -----------------------------
# Load dataset and trained model
# -----------------------------
df = pd.read_csv("genz_google_trends_processed.csv")
model = joblib.load("genz_predictor.pkl")

# Ensure date column is datetime
df["date"] = pd.to_datetime(df["date"], errors="coerce")

# -----------------------------
# Build inputs: trends and dates
# -----------------------------
# Trend options derived from model feature names (e.g., trend_GenZ tech -> GenZ tech)
try:
    feature_names = list(getattr(model, "feature_names_in_", []))
except Exception:
    feature_names = []

trend_prefix = "trend_"
trend_options = sorted(
    [name[len(trend_prefix):] for name in feature_names if name.startswith(trend_prefix)]
) or ["GenZ fashion", "GenZ tech", "GenZ lifestyle", "GenZ social media"]

# Date options: today + next 10 days (no old dates)
today = pd.Timestamp.today().normalize()
future_dates = pd.date_range(start=today, end=today + pd.Timedelta(days=10), freq="D")
date_options = [d.strftime("%Y-%m-%d") for d in future_dates]

# Weekday order for consistent plotting
WEEKDAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# -----------------------------
# Prediction function
# -----------------------------
def predict(trend, date_str):
    # Parse selected date and compute weekday name
    date = pd.to_datetime(date_str, errors="coerce")
    if pd.isna(date):
        message = f"Invalid date: {date_str}. Please pick from the dropdown."
        fig = plt.figure()
        plt.text(0.5, 0.5, message, ha="center", va="center")
        plt.axis("off")
        return message, fig

    weekday = date.day_name()

    # Build feature vector matching the model's training columns
    columns = feature_names if feature_names else []
    features = pd.DataFrame([[0] * len(columns)], columns=columns)

    trend_col = f"{trend_prefix}{trend}"
    weekday_col = f"weekday_{weekday}"

    if trend_col in features.columns:
        features.loc[0, trend_col] = 1
    if weekday_col in features.columns:
        features.loc[0, weekday_col] = 1

    # Predict
    try:
        prediction = float(model.predict(features)[0])
    except Exception as e:
        message = f"Prediction error: {e}"
        fig = plt.figure()
        plt.text(0.5, 0.5, message, ha="center", va="center")
        plt.axis("off")
        return message, fig

    # -----------------------------
    # Chart: average trend values by weekday
    # -----------------------------
    df["weekday"] = df["date"].dt.day_name()

    if trend in df.columns:
        # Wide format: trend is a column
        weekday_avg = df.groupby("weekday")[trend].mean().reindex(WEEKDAY_ORDER).fillna(0.0)
    else:
        # Long format: trend is a row value
        weekday_avg = (
            df[df["trend"] == trend]
            .groupby("weekday")["engagement_score"]
            .mean()
            .reindex(WEEKDAY_ORDER)
            .fillna(0.0)
        )

    # Plot
    fig, ax = plt.subplots(figsize=(8, 4))
    weekday_avg.plot(kind="bar", ax=ax, color="skyblue")
    ax.set_title(f"Average {trend} values by weekday")
    ax.set_ylabel("Trend value")
    ax.set_xlabel("Weekday")
    ax.set_xticklabels(ax.get_xticklabels(), rotation=45, ha="right")

    # Add numeric labels above bars
    for p in ax.patches:
        height = p.get_height()
        ax.annotate(
            f"{height:.2f}",
            (p.get_x() + p.get_width() / 2.0, height),
            ha="center",
            va="bottom",
            fontsize=10,
            color="black",
        )

    plt.tight_layout()

    # Output message includes date and weekday
    output_text = f"Predicted engagement for {trend} on {date_str} ({weekday}): {prediction:.2f}"
    return output_text, fig

# -----------------------------
# Gradio interface
# -----------------------------
iface = gr.Interface(
    fn=predict,
    inputs=[
        gr.Dropdown(trend_options, label="Trend"),
        gr.Dropdown(date_options, label="Date (today + next 10 days)"),
    ],
    outputs=["text", gr.Plot()],
    title="Gen Z Trend Predictor",
    description="Select a trend and a date (today or next 10 days). The prediction shows engagement for that date, and the chart shows average trend values by weekday.",
)

# -----------------------------
# Launch
# -----------------------------
if __name__ == "__main__":
    iface.launch()
