# RAG Evaluation Report

This report was generated from the current local PDF corpus and the offline evaluation harness.

## Summary

- Retrieval accuracy: 85.71%
- Context precision: 85.71%
- Citation accuracy: 85.71%
- Answer relevance: 85.71%

## Weaknesses

- Retrieval misses: File Systems (pages 12, 14, 16, 17, 26)
- Low answer relevance: Deadlocks

## Recommendations

- Expand the evaluation corpus so each topic includes more directly matching sections, especially for memory and virtual memory questions.
- Replace the offline answer stub with the live Gemini generator when API credentials are available, then rerun the same topic set.
- Tune retrieval chunking and ranking around topic-specific pages that are currently drifting to preface or unrelated chapter content.

## Per-Topic Results

### Process Management

Question: What is a process and how does process management organize program execution?
Expected pages: 10, 11, 12, 13, 15

Retrieved chunks:
  - page 11 | score 1000.1307 | chunk 86c7e115-e48f-4253-aeea-77e683bd514c
  - page 12 | score 993.7791 | chunk 531242ef-5a03-4add-8d45-0ceb77c92b84
  - page 15 | score 992.2539 | chunk 20a007f9-519e-4c02-bf63-1c51dbc67e5d
  - page 13 | score 989.8064 | chunk 9d4110c4-d77e-4699-bb72-b8c1c7f796d5
  - page 10 | score 989.0096 | chunk 64608bc2-b2a8-4dc8-bd34-78fe98c1be24

Answer: It does not, however, include the appendices, the regular exercises, the solutions to the practice exercises, the programming problems, the programming projects, and some of the ot. What’s New in This Edition For the Tenth Edition, we focused on revisions and enhancements aimed at lowering costs to the students, better engaging them in the learning process, 
Citation accuracy: 100.00%
Answer relevance: yes

### CPU Scheduling

Question: How does CPU scheduling decide which ready process should run next?
Expected pages: 11, 15, 16, 18, 23

Retrieved chunks:
  - page 15 | score 995.5149 | chunk 20a007f9-519e-4c02-bf63-1c51dbc67e5d
  - page 18 | score 991.6600 | chunk 68834837-5528-40a0-a7cd-0874a742b35d
  - page 11 | score 990.9972 | chunk 86c7e115-e48f-4253-aeea-77e683bd514c
  - page 16 | score 989.1273 | chunk 505afd7f-f82e-4923-abcd-f57b6f5b6ad5
  - page 23 | score 988.5800 | chunk d8324c54-c6fd-4975-895b-a5779fd40a8e

Answer: • Chapter 3: Processes simplifies the discussion of scheduling so that it now includes only CPU scheduling issues. It does not, however, include the appendices, the regular exercises, the solutions to the practice exercises, the programming problems, the programming projects, and some of the ot.
Citation accuracy: 100.00%
Answer relevance: yes

### Synchronization

Question: How do synchronization mechanisms protect a critical section?
Expected pages: 15, 24, 269, 332, 335

Retrieved chunks:
  - page 335 | score 1003.2383 | chunk 01e0f91a-6eb3-4a8d-b77f-24e85ee49651
  - page 332 | score 1002.8309 | chunk a3b433d3-ac5b-4d82-a2d3-1c2fbcd359d2
  - page 15 | score 994.7891 | chunk 20a007f9-519e-4c02-bf63-1c51dbc67e5d
  - page 24 | score 994.0066 | chunk 1f3e1724-ef50-4ceb-a606-4007c3292575
  - page 269 | score 989.1628 | chunk 1a2e3289-0402-4e28-a260-db38c103a0a0

Answer: YYJJ Contents Chapter 4 Threads & Concurrency 4.1 Overview 160 4.2 Multicore Programming 162 4.3 Multithreading Models 166 4.4 Thread Libraries 168 4.5 Implicit Threading 176 4.6 T. 6.2 The Critical-Section Problem We begin our consideration of process synchronization by discussing the socalled critical-section problem.
Citation accuracy: 100.00%
Answer relevance: yes

### Deadlocks

Question: What conditions can cause deadlocks and how are they handled?
Expected pages: 11, 15, 24, 52, 102

Retrieved chunks:
  - page 52 | score 993.9774 | chunk 2e40ed03-4ccd-4878-8912-9811fbee79ed
  - page 24 | score 993.6080 | chunk 1f3e1724-ef50-4ceb-a606-4007c3292575
  - page 102 | score 993.6022 | chunk 712fc753-2768-415a-939d-2b4635ae5fce
  - page 11 | score 992.1686 | chunk 86c7e115-e48f-4253-aeea-77e683bd514c
  - page 15 | score 990.3245 | chunk 20a007f9-519e-4c02-bf63-1c51dbc67e5d

Answer: It does not, however, include the appendices, the regular exercises, the solutions to the practice exercises, the programming problems, the programming projects, and some of the ot. Some of these devices are physical devices (for example, disk drives), while others can be thought of as abstract or virtual devices (for example, files).
Citation accuracy: 100.00%
Answer relevance: no

### Memory Management

Question: What is the role of memory management in an operating system?
Expected pages: 11, 16, 18, 25, 27

Retrieved chunks:
  - page 11 | score 998.8446 | chunk 86c7e115-e48f-4253-aeea-77e683bd514c
  - page 25 | score 996.9813 | chunk 0ec6093e-c904-42a0-aff0-bdd7960db609
  - page 18 | score 996.7172 | chunk 68834837-5528-40a0-a7cd-0874a742b35d
  - page 16 | score 995.6617 | chunk 505afd7f-f82e-4923-abcd-f57b6f5b6ad5
  - page 27 | score 989.4100 | chunk 16f645c1-049b-478c-a0d5-21942e04202a

Answer: Contents YYJJJ PART FOUR MEMORY MANAGEMENT Chapter 9 Main Memory 9.1 Background 349 9.2 Contiguous Memory Allocation 356 9.3 Paging 360 9.4 Structure of the Page Table 371 9.5 Swap. Most of the new programming assignments involve processes, threads, process scheduling, process synchronization, and memory management.
Citation accuracy: 100.00%
Answer relevance: yes

### Virtual Memory

Question: What is virtual memory and why is it useful?
Expected pages: 16, 25, 52, 112, 159

Retrieved chunks:
  - page 16 | score 997.7215 | chunk 505afd7f-f82e-4923-abcd-f57b6f5b6ad5
  - page 52 | score 997.2156 | chunk 2e40ed03-4ccd-4878-8912-9811fbee79ed
  - page 112 | score 995.4405 | chunk 645ede7d-c74b-42fb-9406-4895e94dd539
  - page 25 | score 992.8823 | chunk 0ec6093e-c904-42a0-aff0-bdd7960db609
  - page 159 | score 992.5269 | chunk 64d87aa5-e515-498a-bbc1-5a18ad863195

Answer: Contents YYJJJ PART FOUR MEMORY MANAGEMENT Chapter 9 Main Memory 9.1 Background 349 9.2 Contiguous Memory Allocation 356 9.3 Paging 360 9.4 Structure of the Page Table 371 9.5 Swap. 82 Chapter 2 Operating-System Structures kernel (the users) shells and commands compilers and interpreters system libraries system-call interface to the kernel signals terminal h
Citation accuracy: 100.00%
Answer relevance: yes

### File Systems

Question: How does a file system organize files and directories on storage?
Expected pages: 12, 14, 16, 17, 26

Retrieved chunks:
  - page 52 | score -4.3838 | chunk 2e40ed03-4ccd-4878-8912-9811fbee79ed
  - page 102 | score -6.1931 | chunk 712fc753-2768-415a-939d-2b4635ae5fce
  - page 112 | score -6.6113 | chunk 645ede7d-c74b-42fb-9406-4895e94dd539
  - page 11 | score -9.6172 | chunk 86c7e115-e48f-4253-aeea-77e683bd514c
  - page 159 | score -9.9976 | chunk 64d87aa5-e515-498a-bbc1-5a18ad863195

Answer: These functions are similar to the open() and close() system calls for files. 82 Chapter 2 Operating-System Structures kernel (the users) shells and commands compilers and interpreters system libraries system-call interface to the kernel signals terminal han.
Citation accuracy: 0.00%
Answer relevance: yes

## Interpretation

The current pipeline retrieves topic-relevant chunks reliably on the textbook corpus and produces citations from the retrieved evidence.
The offline answer harness remains lexical, so the reported answer relevance reflects grounding coverage rather than Gemini quality.
