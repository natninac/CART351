import json
import os
import time
from collections import Counter

from flask import Flask, render_template, request, jsonify
import spacy
from spacytextblob.spacytextblob import SpacyTextBlob  

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")
nlp.add_pipe("spacytextblob")

DATA = "data/entries.json"




def load():
    if not os.path.exists(DATA):
        return []
    with open(DATA) as f:
        return json.load(f)


def save(entries):
    os.makedirs("data", exist_ok=True)
    with open(DATA, "w") as f:
        json.dump(entries, f, indent=2)


def analyze(text):
    """spaCy + spacytextblob: word types, emotional words, overall tone."""
    doc = nlp(text)

    #what types of words: (noun, verb, adjective...)
    pos = Counter(t.pos_ for t in doc if not (t.is_punct or t.is_space))
    word_types = [[spacy.explain(tag) or tag, count] for tag, count in pos.most_common()]

    #which words point at an emotion, and in which direction
    emotion_words = [
        {"words": " ".join(words), "polarity": round(p, 2)}
        for words, p, _subj, _ in doc._.blob.sentiment_assessments.assessments
    ]

    #positive? negative? neutral?
    polarity = doc._.blob.polarity          #-1 (negative), +1 (positive)
    subjectivity = doc._.blob.subjectivity  # 0 (factual),  1 (personal opinion)
    if polarity > 0.05:
        overall = "positive"
    elif polarity < -0.05:
        overall = "negative"
    else:
        overall = "neutral"

    return {
        "word_types": word_types,
        "emotion_words": emotion_words,
        "polarity": round(polarity, 2),
        "subjectivity": round(subjectivity, 2),
        "overall": overall,
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/past")
def past():
    return render_template("past.html")


@app.route("/submit", methods=["POST"])
def submit():
    p = request.get_json()
    words = sorted(p["words"], key=lambda w: w["pause"], reverse=True)
    entry = {
        "time": time.time(),
        "name": p.get("name", "").strip() or "anonymous",  # who wrote it
        "hour": p["hour"],
        # how user interacted (from the js markers)
        "mouse": p["mouse"],
        "typing": p["typing"],
        "breaks": p["breaks"],
        "hesitations": [w for w in words if w["pause"] > 1500][:5],
        "deletions": p["deletions"],  # number of backspaces
        "deleted": p["deleted"],      # the text they erased

        # what they wrote (from spaCy)
        "language": analyze(p["text"]),
    }
    entries = load()
    entries.append(entry)
    save(entries)
    return jsonify(entry)


@app.route("/entries")
def entries():
    return jsonify(load())


if __name__ == "__main__":
    app.run(debug=True)
