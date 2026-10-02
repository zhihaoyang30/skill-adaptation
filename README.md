# Evolving to Match Capabilities
## Improving Harness Self-Evolution via Skill Adaptation

The same agent skill can improve a strong model while degrading a weaker one. This paper investigates why this happens and how to adapt skills to the capabilities of the model executing them.

Across seven models spanning three capability tiers, well-crafted skills improve GPT-5.6-luna by **31.1 score points**, yet reduce Gemma-4-E4B's score by **8.8 points**. In **86% of failed weak-model runs**, the violated requirement is already stated in the skill, suggesting that effective guidance depends on how instructions are organized and presented.

We analyze recurring failures in instruction following, context management, tool execution, and verification, and distill these findings into a **meta-skill**—a fixed rewriting protocol for adapting skills to the executor. We also integrate this protocol into **harness self-evolution**, where agents iteratively revise their skills using execution trajectories and verifier feedback.

### Key Results

Evaluated on **103 skill-sensitive task–skill pairs** selected from 607 pairs across **SkillsBench, DocOps, and Tessl**:

- **One-shot adaptation:** the meta-skill improves three weak executors by **5.1–14.1 score points** over the original skills.
- **Five-round self-evolution:** the meta-skill-guided loop outperforms the same loop without it by **2.0–5.1 score points** across all seven executors.

These findings highlight the importance of adapting agent skills to model capabilities, both before execution and throughout iterative self-improvement.

### Method Overview

![Meta-skill construction and harness self-evolution](assets/fig3_pipeline.png)
