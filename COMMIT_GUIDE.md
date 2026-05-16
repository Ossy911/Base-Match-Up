# 80 Commits Guide for Base Match Up

To reach your goal of 80 commits, use the following logical steps. Each group represents features you can commit one by one.

### Phase 1: Foundation (1-5)
1. init: create project folder structure
2. docs: add initial README.md
3. feat: add basic index.html structure
4. feat: define CSS design tokens and variables
5. feat: implement glassmorphism card styles

### Phase 2: Web3 Core (6-15)
6. feat: add wallet connection button UI
7. feat: implement basic Web3 provider detection
8. feat: add connect wallet logic using eth_requestAccounts
9. feat: implement chain ID detection logic
10. feat: add Base network configuration constants
11. feat: implement network switching logic for Base L2
12. feat: add "Switch to Base" button UI
13. feat: add network-specific warning banners
14. feat: implement wallet address display formatting
15. fix: handle wallet rejection errors gracefully

### Phase 3: Onboarding (16-20)
16. feat: add username input field
17. feat: implement local storage for username persistence
18. feat: add validation for Start Game button
19. feat: implement onboarding to game screen transition
20. style: add animations for onboarding entrance

### Phase 4: Grid Engine (21-30)
21. feat: implement 8x8 grid generation logic
22. feat: define tile types and colors
23. feat: implement tile rendering system
24. feat: add responsive grid layout using CSS Grid
25. feat: implement board initialization logic
26. feat: add logic to prevent matches on startup
27. style: add smooth hover effects for tiles
28. feat: implement tile coordinate mapping
29. feat: add data attributes for tile indexing
30. style: add board container backdrop

### Phase 5: Interaction (31-40)
31. feat: implement mouse click tile selection
32. feat: add selection highlighting UI
33. feat: implement adjacency check for swaps
34. feat: implement basic tile swapping logic
35. feat: implement touchstart listener for mobile
36. feat: implement touchend swipe detection
37. feat: add horizontal swipe logic
38. feat: add vertical swipe logic
39. feat: implement swipe-to-swap mapping
40. style: add CSS transitions for tile movement

### Phase 6: Match Logic (41-50)
41. feat: implement horizontal match detection (3+)
42. feat: implement vertical match detection (3+)
43. feat: implement match clearing logic
44. feat: implement basic gravity (tiles falling)
45. feat: implement new tile spawning logic
46. feat: implement chain reaction (recursive matching)
47. feat: add score calculation logic
48. feat: implement move limit counter
49. fix: prevent interaction during board processing
50. fix: handle edge cases for row-wrap matches

### Phase 7: Gameplay Progression (51-60)
51. feat: implement level tracking state
52. feat: add level display UI
53. feat: implement score target logic per level
54. feat: implement level complete condition
55. feat: add Level Success modal UI
56. feat: implement "Next Level" button logic
57. feat: implement game over state
58. feat: add level-based difficulty scaling (fewer moves)
59. feat: implement high score local persistence
60. style: add animations for level transitions

### Phase 8: Base Integration (61-70)
61. feat: define Base Builder Code constant
62. feat: define Encoded Builder String constant
63. feat: implement attribution data suffix utility
64. feat: implement Daily Check-in transaction logic
65. feat: add check-in button to game footer
66. feat: implement Score Submission transaction logic
67. feat: add score submission button to footer
68. feat: implement transaction loading state UI
69. feat: add Basescan link generation for txs
70. feat: handle on-chain transaction success notifications

### Phase 9: Polish & FX (71-80)
71. feat: implement particle system for matched tiles
72. feat: add screen shake effect on matches
73. feat: implement Web Audio API sound synthesizer
74. feat: add swap sound effect
75. feat: add match sound effect
76. feat: add level win sound effect
77. feat: implement particle color matching
78. feat: add subtle background pulse animation
79. style: final responsiveness pass for tablet/mobile
80. docs: update final README with game instructions
