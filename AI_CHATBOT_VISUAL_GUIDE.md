# 🎨 AI CHATBOT - VISUAL GUIDE

## 🖼️ User Interface Preview

### 1. Floating Chatbot Button
```
┌─────────────────────────────────────────────────┐
│                                                 │
│                            ┌───┐               │
│                            │🤖 │ ← Click Here! │
│                            └───┘               │
│                        (Bottom-right)          │
│                                                 │
└─────────────────────────────────────────────────┘
```
- **Location:** Fixed at bottom-right corner
- **Size:** 60x60 pixels
- **Color:** Green-blue gradient
- **Action:** Click to open/close chat

---

### 2. Floating Chat Window (Open)
```
┌──────────────────────────────────────────────┐
│  🤖 AI Health Assistant          [X]         │  ← Header
├──────────────────────────────────────────────┤
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │ 👋 Hi! I'm your AI Health          │    │  ← Bot Message
│  │ Assistant. How can I help?         │    │
│  └─────────────────────────────────────┘    │
│                                              │
│              ┌─────────────────────────┐    │
│              │ I have chest pain       │    │  ← User Message
│              └─────────────────────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │ Based on your symptoms, I           │    │
│  │ recommend consulting a              │    │  ← Bot Response
│  │ Cardiologist immediately.           │    │
│  │                                     │    │
│  │ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓    │    │
│  │ ┃ 👨‍⚕️ Recommended Doctor      ┃    │    │
│  │ ┃ Name: Dr. Aarav Nair       ┃    │    │  ← Doctor Card
│  │ ┃ Specialization: Cardiology ┃    │    │
│  │ ┃ [📅 Book Appointment]      ┃    │    │
│  │ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  • • •  (typing...)                         │  ← Loading
│                                              │
├──────────────────────────────────────────────┤
│ [Type your question here...    ] [📤 Send]  │  ← Input
└──────────────────────────────────────────────┘
```

**Dimensions:** 380px wide × 550px tall  
**Position:** Bottom-right, above the button  
**Animation:** Slides up from bottom

---

### 3. Full Page AI Assistant
```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  🤖  AI Health Assistant                              │     │
│  │      Powered by Google Gemini AI                      │     │  ← Header
│  └──────────────────────────────────────────────────────┘     │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐     │
│  │                    CHAT AREA                          │     │
│  │  ┌──────────────────────────────────────────┐        │     │
│  │  │ 👋 Hello! I'm your AI Health Assistant. │        │     │
│  │  │ I can help you with:                     │        │     │
│  │  │ • Symptom analysis and doctor suggestions│        │     │
│  │  │ • Disease information                    │        │     │
│  │  │ • Medicine queries                       │        │     │
│  │  │ • General health questions               │        │     │
│  │  └──────────────────────────────────────────┘        │     │
│  │                                                        │     │
│  │                  ┌──────────────────────┐            │     │
│  │                  │ I have chest pain    │            │     │
│  │                  └──────────────────────┘            │     │
│  │                                                        │     │
│  │  ┌──────────────────────────────────────────┐        │     │
│  │  │ Based on your symptoms of chest pain...  │        │     │
│  │  │                                          │        │     │
│  │  │  ╔════════════════════════════════╗      │        │     │
│  │  │  ║ 👨‍⚕️ Recommended Doctor         ║      │        │     │
│  │  │  ║                                ║      │        │     │
│  │  │  ║ Name: Dr. Aarav Nair          ║      │        │     │
│  │  │  ║ Specialization: Cardiologist  ║      │        │     │
│  │  │  ║ Qualification: MD Cardiology  ║      │        │     │
│  │  │  ║ Experience: 15 years          ║      │        │     │
│  │  │  ║                                ║      │        │     │
│  │  │  ║  [📅 Book Appointment]        ║      │        │     │
│  │  │  ╚════════════════════════════════╝      │        │     │
│  │  └──────────────────────────────────────────┘        │     │
│  │                                                        │     │
│  │  (Scrollable - 600px height)                          │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                │
│  ╔═══════════════════════════════════════════════════════╗    │
│  ║ 💡 Quick Questions:                                    ║    │
│  ║  [I have chest pain] [What is Paracetamol?]           ║    │
│  ║  [I feel dizzy]      [Tell me about diabetes]         ║    │
│  ╚═══════════════════════════════════════════════════════╝    │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ [Type your health question here...      ] [📤 Send]  │     │  ← Input
│  └──────────────────────────────────────────────────────┘     │
│                                                                │
│  ⚠️ Disclaimer: This AI provides general information only.    │
│     Always consult a healthcare professional for diagnosis.    │
└────────────────────────────────────────────────────────────────┘
```

**URL:** `http://localhost:3001/ai-assistant`  
**Width:** Max 1024px, responsive  
**Layout:** Full page with header, chat, and input

---

## 🎨 Color Scheme

### Primary Colors
```
┌─────────────┬──────────────┬─────────────┐
│   Green     │     Blue     │    Gray     │
├─────────────┼──────────────┼─────────────┤
│  #10b981    │   #3b82f6    │  #f9fafb    │
│  (Emerald)  │  (Sky Blue)  │  (Slate)    │
└─────────────┴──────────────┴─────────────┘
```

### Gradient (Floating Button)
```
        Green #10b981
         ↓
    Gradient 135°
         ↓
        Blue #3b82f6
```

### Message Colors
```
User Messages:    #3b82f6 (Blue) with white text
Bot Messages:     #f9fafb (Light Gray) with black text
Doctor Cards:     #f0fdf4 (Light Green) with green border
```

---

## 🎭 Animations

### 1. Slide Up (Chat Window Opens)
```
Frame 1: opacity: 0,    transform: translateY(20px)
         ↓ 0.3s ease
Frame 2: opacity: 1,    transform: translateY(0)
```

### 2. Typing Indicator (Bouncing Dots)
```
Dot 1:  ●  ○  ○   (bounce up)
        ↓
Dot 2:  ○  ●  ○   (bounce up)
        ↓
Dot 3:  ○  ○  ●   (bounce up)
        ↓
Repeat (1.4s cycle)
```

### 3. Button Hover
```
Normal:  scale(1.0)   shadow: 0 4px 12px
         ↓ 0.2s
Hover:   scale(1.1)   shadow: 0 6px 20px
```

---

## 📱 Responsive Design

### Desktop (>1024px)
```
┌─────────────────────────────────┐
│  Full Width Chat Interface       │
│  380px Floating Widget           │
│  Large Quick Question Buttons    │
└─────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌──────────────────────────┐
│  Responsive Chat         │
│  Floating Widget         │
│  Medium Buttons          │
└──────────────────────────┘
```

### Mobile (<768px)
```
┌────────────────┐
│  Full Width    │
│  Chat          │
│  Compact       │
│  Widget        │
│  (calc 100% -  │
│   20px)        │
└────────────────┘
```

---

## 🔤 Typography

### Fonts
```
Primary:    System Font Stack
            -apple-system, BlinkMacSystemFont, 'Segoe UI'

Headers:    font-weight: 700 (Bold)
            font-size: 24px - 32px

Body Text:  font-weight: 400 (Regular)
            font-size: 14px - 16px

Buttons:    font-weight: 600 (Semi-Bold)
            font-size: 14px
```

---

## 🎯 Interactive Elements

### Button States
```
Normal:      background: #3b82f6
             ↓ hover
Hover:       background: #2563eb (darker)
             ↓ active
Active:      background: #1d4ed8 (even darker)
             ↓ disabled
Disabled:    background: #9ca3af (gray)
             cursor: not-allowed
```

### Input Field States
```
Normal:      border: 1px solid #d1d5db
             ↓ focus
Focus:       border: 1px solid #3b82f6
             box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
```

---

## 💬 Message Bubble Styles

### User Message (Right Aligned)
```
┌────────────────────────────────────┐
│                   ┌──────────────┐ │
│                   │ User message │ │
│                   │ here...      │ │
│                   │ 10:30 AM     │ │
│                   └──────────────┘ │
└────────────────────────────────────┘

Style:
- Background: #3b82f6
- Text Color: White
- Border Radius: 16px
- Padding: 12px 16px
- Max Width: 75%
- Float: Right
```

### Bot Message (Left Aligned)
```
┌────────────────────────────────────┐
│ ┌──────────────┐                   │
│ │ 🤖 AI        │                   │
│ │ Bot message  │                   │
│ │ here...      │                   │
│ │ 10:30 AM     │                   │
│ └──────────────┘                   │
└────────────────────────────────────┘

Style:
- Background: #ffffff
- Text Color: #1f2937
- Border Radius: 16px
- Padding: 12px 16px
- Max Width: 75%
- Float: Left
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
```

---

## 🏥 Doctor Recommendation Card

### Card Layout
```
╔════════════════════════════════════════╗
║  👨‍⚕️ Recommended Doctor                 ║
╟────────────────────────────────────────╢
║  Name: Dr. Aarav Nair                  ║
║  Specialization: Cardiologist          ║
║  Qualification: MD Cardiology          ║
║  Experience: 15 years                  ║
║                                        ║
║  ┌──────────────────────────────────┐ ║
║  │  📅 Book Appointment              │ ║
║  └──────────────────────────────────┘ ║
╚════════════════════════════════════════╝

Style:
- Background: #f0fdf4 (light green)
- Border: 3px solid #10b981
- Border Radius: 8px
- Padding: 12px
- Margin Top: 8px
- Font Size: 14px
- Button: Green (#10b981)
```

---

## 🔔 Quick Questions Section

### Layout (First Time User)
```
╔═══════════════════════════════════════════╗
║  💡 Quick Questions:                       ║
╟───────────────────────────────────────────╢
║  ┌────────────────────┬─────────────────┐ ║
║  │ I have chest pain  │ What is         │ ║
║  │ and shortness of   │ Paracetamol     │ ║
║  │ breath             │ used for?       │ ║
║  └────────────────────┴─────────────────┘ ║
║  ┌────────────────────┬─────────────────┐ ║
║  │ I feel dizzy and   │ Tell me about   │ ║
║  │ tired              │ diabetes        │ ║
║  └────────────────────┴─────────────────┘ ║
╚═══════════════════════════════════════════╝

Style:
- Background: #f9fafb
- Border Top: 1px solid #e5e7eb
- Padding: 16px
- Grid: 2 columns
- Gap: 8px
- Button: White with border
- Hover: Light blue background
```

---

## 🎬 User Flow Visualization

### Complete Interaction Flow
```
Start
  │
  ├─→ User sees page
  │    │
  │    └─→ Notices 🤖 button (bottom-right)
  │         │
  │         └─→ Clicks button
  │              │
  │              ├─→ Window slides up (0.3s)
  │              │
  │              └─→ Welcome message appears
  │                   │
  │                   └─→ User types question
  │                        │
  │                        └─→ Clicks Send
  │                             │
  │                             ├─→ Message bubble appears (user)
  │                             │
  │                             ├─→ Typing indicator shows (• • •)
  │                             │    │
  │                             │    └─→ 2-3 seconds wait
  │                             │
  │                             ├─→ Bot message appears
  │                             │
  │                             ├─→ Doctor card displays (if symptom)
  │                             │    │
  │                             │    └─→ "Book Appointment" button
  │                             │         │
  │                             │         └─→ User clicks
  │                             │              │
  │                             │              └─→ Redirects to dashboard
  │                             │                   │
  │                             │                   └─→ Appointment form opens
  │                             │                        │
  │                             │                        └─→ Doctor pre-selected
  │                             │                             │
  │                             │                             └─→ User books appointment
  │                             │                                  │
  │                             │                                  └─→ Success! ✅
  │                             │
  │                             └─→ Chat history saved to MongoDB
  │
  └─→ User can close chat
       │
       └─→ Window slides down
            │
            └─→ Only button visible
                 │
                 └─→ Available on all pages
```

---

## 📊 Component States

### FloatingChatbot States
```
State 1: CLOSED
  Button: Visible (🤖)
  Window: Hidden
  ↓ click
  
State 2: OPEN
  Button: Visible (✖️)
  Window: Visible
  Messages: Displayed
  ↓ type & send
  
State 3: LOADING
  Button: Visible (✖️)
  Window: Visible
  Messages: Displayed
  Typing: • • • (animated)
  Input: Disabled
  ↓ response received
  
State 4: RESPONSE
  Button: Visible (✖️)
  Window: Visible
  Messages: Updated
  Doctor Card: Shown (if applicable)
  Input: Enabled
```

---

## 🎨 Theme Customization

### Light Theme (Default)
```
Background:     #ffffff (white)
Text:           #1f2937 (dark gray)
Cards:          #f9fafb (light gray)
Borders:        #e5e7eb (gray)
Primary:        #10b981 (green)
Secondary:      #3b82f6 (blue)
```

### Dark Theme (Future)
```
Background:     #1f2937 (dark gray)
Text:           #f9fafb (light gray)
Cards:          #374151 (medium gray)
Borders:        #4b5563 (gray)
Primary:        #10b981 (green)
Secondary:      #3b82f6 (blue)
```

---

## 🔢 Dimensions Reference

### Floating Button
```
Width:     60px
Height:    60px
Border Radius: 50% (circle)
Position:  Fixed
Bottom:    30px
Right:     30px
Z-Index:   1000
```

### Floating Window
```
Width:     380px
Height:    550px
Border Radius: 16px
Position:  Fixed
Bottom:    100px
Right:     30px
Z-Index:   1000
Shadow:    0 8px 32px rgba(0,0,0,0.2)
```

### Full Page Container
```
Max Width: 1024px
Margin:    0 auto
Padding:   24px
Height:    100vh (full viewport)
```

### Chat Area
```
Height:    600px (fixed)
Overflow:  auto (scrollable)
Padding:   24px
```

### Message Bubbles
```
Max Width: 75% (of chat width)
Padding:   12px 16px
Border Radius: 16px
Margin:    12px (between messages)
```

### Doctor Card
```
Width:     100% (of message bubble)
Padding:   12px
Border:    3px solid
Border Radius: 8px
Margin:    8px 0 (top and bottom)
```

---

**Visual Guide Complete! 🎨**

This guide provides all the visual specifications for implementing and customizing the AI Chatbot interface.
