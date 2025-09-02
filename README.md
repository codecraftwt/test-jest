# Hacker Native - Test Assignment

## Overview
This repository contains unit and component tests for the Hacker Native Expo app.  
Tests are written using **Jest** and **React Native Testing Library (RTL)** in a **TypeScript** environment.

## Features Tested
1. **PostList Component**
   - Initial render of posts
   - Infinite scroll / load more posts
   - Loading and error states
   - Navigation to Post Detail

2. **Search Component**
   - Render search input
   - Fetch and display search results
   - Handle empty results & errors
   - Debounce/throttle handling (if applicable)

3. **Post Detail + Comments**
   - Post content rendering
   - Conditional comments rendering
   - Refresh comments interaction
   - Handling empty comments
   - Formatted content (bold, blockquote)

4. **Feedback Form**
   - Star rating validation
   - Submit feedback to AsyncStorage
   - Load saved feedback
   - Handle AsyncStorage errors
   - Success/error messages

5. **Accessibility (Bonus)**
   - Accessible roles and labels
   - Buttons, lists, inputs

---

## Setup & Installation

```bash
# Clone repo
git clone <repo-url>
cd hacker-native

# Install dependencies
npm install

# Start Expo app
npm start
