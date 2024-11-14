---
layout: page
title: "Emosical: An Emotion-Annotated Musical Theatre Dataset"
---

<a href='pdfs/emosical.pdf'>pdf</a> <a href='https://github.com/gillosae/emosical'>github</a> <a href='images/emosical_poster.png'>poster</a> 

## Abstract
This paper presents Emosical, a multimodal open-source dataset of musical films. Emosical comprises video, vocal audio, text, and character identity paired samples with annotated emotion tags. Emosical provides rich emotion annotations for each sample by inferring the background story of the characters. To achieve this, we leverage the musical theatre script, which contains the characters' complete background stories and narrative contexts. The annotation pipeline includes feeding the speaking character, text, global persona, and context of the dialogue and song track into a large language model. To verify the effectiveness of our tagging scheme, we perform an ablation study by bypassing each step of the pipeline. The ablation results show the usefulness of each component in generating accurate emotion tags. A subjective test is conducted to compare the generated tags of each ablation result. We also perform a statistical analysis to find out the global characteristics of the collected emotion tags. Emosical would enable expressive synthesis and tagging of the speech and singing voice in the musical theatre domain in future research. Emosical is publicly available at https://github.com/gillosae/emosical.

## Overview of Emotion Inferring Process.
![Emotion Inferring Process](/images/what3.png)

## Dataset Collection Process.
![Dataset Collection Process](/images/emosical_data_collection4.png)

## Summary of Emosical Dataset Statistics.
![Emosical Statistics](/images/emosical_statistics.png)

## Primary Emotion Tags of Emosical.
![Primary Emotions of Emosical](/images/primary_bar.png)

## Word Cloud of Emotion Tags.
![Word cloud of Emosical](/images/emotion_wordcloud.png)

## Ablation Results of Emosical.
![Emosical Ablation Results](/images/emotion_ablation.png)
![Emosical Ablation MOS Results](/images/emotion_ablation_mos.png)
- Ablation 1: Text only. 
- Ablation 2: Text + Character. 
- Ablation 3: Text + Character + Scene Summarization.
- Proposed: Text + Character + Scene Summarization + Global Persona.