<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApplicationConfirmationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $applicationData;
    public $jobTitle;
    public $applicantName;

    /**
     * Create a new message instance.
     */
    public function __construct($applicationData, $jobTitle, $applicantName)
    {
        $this->applicationData = $applicationData;
        $this->jobTitle = $jobTitle;
        $this->applicantName = $applicantName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Konfirmasi Lamaran - ' . $this->jobTitle,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.application-confirmation',
        );
    }
}