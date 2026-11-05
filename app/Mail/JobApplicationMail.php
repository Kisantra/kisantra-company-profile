<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class JobApplicationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    /**
     * Create a new message instance.
     */
    public function __construct($emailData)
    {
        $this->data = $emailData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Job Application: ' . $this->data['job_title'] . ' - ' . $this->data['applicant_name'],
            replyTo: [$this->data['applicant_email']],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.job-application-recruitment',
            with: [
                'jobTitle' => $this->data['job_title'],
                'jobId' => $this->data['job_id'],
                'batch' => $this->data['batch'] ?? '-',
                'applicantName' => $this->data['applicant_name'],
                'applicantEmail' => $this->data['applicant_email'],
                'applicantPhone' => $this->data['applicant_phone'],
                'applicantAddress' => $this->data['applicant_address'] ?? $this->data['alamat'] ?? '-',
                'education' => $this->data['education'] ?? '-',
                'graduationYear' => $this->data['graduation_year'] ?? '-',
                'gpa' => $this->data['gpa'] ?? null,
                'experience' => $this->data['experience'] ?? '-',
                'onlineTest' => $this->onlineTestSummary(),
                'linkedinUrl' => $this->data['linkedin_url'],
                'source' => $this->data['source'],
                'coverLetter' => $this->data['cover_letter'],
                'documents' => $this->data['documents'] ?? [],
                'savedInAttendance' => $this->data['saved_in_attendance'] ?? true,
            ],
        );
    }

    private function onlineTestSummary(): string
    {
        if (! isset($this->data['online_test_ready'])) {
            return '-';
        }

        $period = $this->data['online_test_period'] ?? null;

        return ($this->data['online_test_ready'] ? 'Ready' : 'Not ready')
            .' (laptop + camera'.($period ? ', '.$period : '').')';
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        $attachments = [];
        if (!empty($this->data['files'])) {
            foreach ($this->data['files'] as $file) {
                $attachments[] = Attachment::fromPath($file['path'])
                    ->as($file['name'])
                    ->withMime($file['mime']);
            }
        }
        return $attachments;
    }
}
