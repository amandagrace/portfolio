<?php

    // Only process POST reqeusts.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.
        $name = strip_tags(trim($_POST["name"]));
				$name = str_replace(array("\r","\n"),array(" "," "),$name);
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $message = trim($_POST["message"]);

        // Check that data was sent to the mailer.
        if ( empty($name)) {
						http_response_code(400);
						echo "nameError";
						exit;
				} else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo "emailError";
            exit;
        } else if (empty($message)) {
						http_response_code(400);
						echo "messageError";
						exit;
				}

        // Set the recipient email address.
        $recipient = "yourstruly@amandagracewall.com";

        // Set the email subject.
        $subject = "New contact from $name";

        // Build the email content.
        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Message:\n$message\n";

        // Build the email headers.
        $email_headers = "From: $name <$email>";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            echo "Thanks! Your message was sent.";
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            echo "generalError";
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "general-error";
    }

?>
