$(document).ready(function() {
  let clock;
  
  // Function to update or start the countdown
  function updateCountdown(eventName, targetDate) {
    // Calculate the difference in seconds between the future and current date
    const currentDate = new Date();
    const diff = moment(targetDate).valueOf() / 1000 - currentDate.getTime() / 1000;
    
    if (diff <= 0) {
      // If remaining countdown is 0
      clock = $(".clock").FlipClock(0, {
        clockFace: "DailyCounter",
        countdown: true,
        autostart: false
      });
      alert("Date has already passed!");
      
    } else {
      // Run countdown timer

      // Update the event name display
      $('#eventTitle').text("Counting down to "+eventName);

      clock = $(".clock").FlipClock(diff, {
        clockFace: "DailyCounter",
        countdown: true,
        callbacks: {
          stop: function() {
            console.log("Timer has ended!");
            // Display a completion message or perform other actions
          }
        }
      });
      
      // Check when timer reaches 0, then stop at 0
      setTimeout(function() {
        checktime();
      }, 1000);
      
      function checktime() {
        const t = clock.getTime();
        if (t <= 0) {
          clock.setTime(0);
        }
        setTimeout(function() {
          checktime();
        }, 1000);
      }
    }
  }
  
  // Check if event data exists in local storage
  const eventData = localStorage.getItem('eventData');
  if (eventData) {
    const { eventName, targetDate } = JSON.parse(eventData);
    $('#eventName').val(eventName);
    $('#targetDate').val(targetDate);
    updateCountdown(eventName, targetDate); // Start the countdown with saved data
  }
  
  // Event listener for Save Event button
  $('#saveEvent').on('click', function() {
    const eventName = $('#eventName').val();
    const targetDate = $('#targetDate').val();
    
    // Validate inputs
    if(eventName && targetDate) {
      // Save event data to local storage
      const eventData = {
        eventName,
        targetDate
      };
      localStorage.setItem('eventData', JSON.stringify(eventData));
      
      // Restart or update the countdown with new data
      updateCountdown(eventName, targetDate);
    } else {
      alert('Please enter event name and target date.');
    }
  });

  // Event listener for Reset button
  $('#resetEvent').on('click', function() {
    // Clear input fields and local storage
    $('#eventName').val('');
    $('#targetDate').val('');
    localStorage.removeItem('eventData');

    // Stop and reset the countdown
    if (clock) {
      clock.stop();
      clock.setTime(0);
    }

    // Clear the event name display
    $('#eventTitle').text('');
  });

  // Event listener for Share on Facebook icon
  $('#shareFacebook').on('click', function(e) {
    e.preventDefault();

    const eventName = $('#eventName').val();
    const targetDate = $('#targetDate').val();

    const countdownURL = window.location.href; // Get the current URL

    const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(countdownURL)}&quote=Counting%20down%20to%20${encodeURIComponent(eventName)}`;

    window.open(facebookShareURL, '_blank');
  });

  // Event listener for Share on Twitter icon
  $('#shareTwitter').on('click', function(e) {
    e.preventDefault();

    const eventName = $('#eventName').val();
    const targetDate = $('#targetDate').val();

    const countdownURL = window.location.href; // Get the current URL

    const twitterShareURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(countdownURL)}&text=Counting%20down%20to%20${encodeURIComponent(eventName)}`;

    window.open(twitterShareURL, '_blank');
  });
});