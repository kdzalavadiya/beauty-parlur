# New Real Bridal Studio Website

An elegant and modern website for a luxury bridal studio, featuring a variety of services and customer interaction features.

## AI Assistant Implementation

The website includes an AI assistant feature to help visitors with questions about bridal services, pricing, and appointments. 

### Recent Update: Reverting to Old AI Mini Chat

We have reverted from the new AI Dashboard interface to the old AI Mini Chat window based on user feedback. The old interface is more compact and provides a simpler user experience.

#### Changes Made:

1. **Created dedicated files for the old AI chat:**
   - `css/old-ai-chat.css`: Styling for the compact floating chat window
   - `js/old-ai-chat.js`: JavaScript implementation with simple chat functionality

2. **Disabled the new AI Dashboard:**
   - The dashboard and its floating bubble are now hidden
   - All navigation buttons now point to the old chat interface
   - Removed dashboard initialization scripts

3. **Updated the main index.js:**
   - Removed duplicate chat functionality
   - Ensured proper hiding of the dashboard

#### Features of the Old AI Mini Chat:

- **Compact design:** Takes minimal screen space
- **Floating chat button:** Accessible from any page section
- **Simple interface:** Easy to use with just a text input and send button
- **Responsive design:** Works well on mobile devices
- **Sample responses:** Includes responses to common questions about bridal services

#### Technical Implementation:

The chat implementation uses vanilla JavaScript with a class-based approach. It creates DOM elements on-the-fly and handles user interactions through event listeners. The chat uses a keyword-based response system to provide relevant answers about bridal services, pricing, and appointments.

## Usage

Simply click on the "AI Assistant" button in the navigation bar or the floating chat button in the corner of the screen to open the chat window. Type your question and press Enter or click the send button to get a response.

## Future Improvements

- Add more comprehensive responses
- Implement true AI integration with APIs like OpenAI
- Add voice input capability
- Include image recognition for bridal style suggestions

## How to View the Website

### Direct Browser Viewing (No Server Required)

To view the website without a server, simply:

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Press F5 to refresh the page if needed

This method allows you to browse the website without any server setup. Form submissions will display success messages but won't actually send data.

### Using the Node.js Server (Optional)

If you want to run the website with its backend server:

1. Ensure you have Node.js installed (v12 or higher)
2. Open a terminal/command prompt in the project directory
3. Run `node server.js`
4. Open your browser and navigate to `http://localhost:3000`

Running the website with the server provides the same visual experience but would allow form submissions to be processed (in a real-world scenario).

## Features

- Responsive design for all devices
- Modern and clean UI
- Interactive elements
- Optimized loading performance
- Accessibility features
- Service catalog and pricing information

## Browser Compatibility

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Notes

- This is a frontend-focused site with mock functionality for form submissions
- In a production environment, form data would be sent to a server for processing

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Custom Properties)
- JavaScript (ES6+)
- Font Awesome for icons
- Google Maps API
- CSS Animations and Transitions

## Setup

1. Clone the repository
2. Open `index.html` in your browser

## Structure

- `index.html` - Main HTML file
- `css/` - Stylesheets
  - `styles.css` - Main styles
  - `mobile-nav.css` - Mobile navigation styles
  - `gallery.css` - Gallery styles
- `js/` - JavaScript files
  - `main.js` - Main JavaScript functionality
  - `gallery.js` - Gallery and lightbox functionality
  - `contact.js` - Contact form handling
  - `booking.js` - Booking form functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For inquiries, please contact [your-email@example.com] 