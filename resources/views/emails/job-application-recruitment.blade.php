<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Job Application</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #374151; line-height: 1.6;">

    <!-- Main Wrapper -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; padding: 40px 0;">
        <tr>
            <td align="center">
                
                <!-- Email Container -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; max-width: 600px; width: 100%; border-radius: 4px; border: 1px solid #e5e7eb;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 10px 40px; border-bottom: 2px solid #0d9488;">
                            <p style="margin: 0; font-size: 12px; font-weight: 700; color: #0d9488; text-transform: uppercase; letter-spacing: 1px;">New Candidate Application</p>
                            <h1 style="color: #111827; font-size: 20px; font-weight: 600; margin: 8px 0 0 0;">
                                {{ $jobTitle }}
                            </h1>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 30px 40px 40px 40px;">

                            <!-- Applicant Summary -->
                            <div style="margin-bottom: 32px;">
                                <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 16px 0;">Applicant Details</h2>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    @if(!empty($batch) && $batch !== '-')
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280; width: 140px;">Batch</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #0d9488; font-weight: 600;">{{ $batch }}</td>
                                    </tr>
                                    @endif
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280; width: 140px;">Full Name</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #111827; font-weight: 500;">{{ $applicantName }}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Email Address</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #111827;"><a href="mailto:{{ $applicantEmail }}" style="color: #111827; text-decoration: none;">{{ $applicantEmail }}</a></td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Phone Number</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #111827;">{{ $applicantPhone ?? '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Domicile</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #111827;">{{ $applicantAddress ?? '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Education</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #111827;">{{ $education }}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Graduation Year</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #111827;">{{ $graduationYear }}{{ $gpa ? ' · GPA '.$gpa : '' }}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Experience</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #111827;">{{ $experience }}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Online Test</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #111827;">{{ $onlineTest }}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Data Consent</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #111827;">Agreed to recruitment data processing</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">LinkedIn</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #111827;">
                                            @if(!empty($linkedinUrl) && $linkedinUrl !== '-')
                                                <a href="{{ $linkedinUrl }}" target="_blank" style="color: #0d9488; text-decoration: none;">View Profile &rarr;</a>
                                            @else
                                                -
                                            @endif
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Source</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #111827;">{{ ucfirst($source ?? '-') }}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Cover Letter -->
                             @if(!empty($coverLetter) && $coverLetter !== '-')
                                <div style="margin-bottom: 32px;">
                                    <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 12px 0;">Cover Letter</h2>
                                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 4px; font-size: 14px; color: #4b5563; white-space: pre-wrap; line-height: 1.7;">{{ $coverLetter }}</div>
                                </div>
                            @endif

                            <!-- Documents -->
                            <div>
                                <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 12px 0;">Documents</h2>
                                @if(empty($documents))
                                    <p style="margin: 0; font-size: 14px; color: #6b7280;">No documents were uploaded.</p>
                                @else
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #e5e7eb;">
                                        @foreach($documents as $document)
                                        <tr>
                                            <td style="padding: 10px 0; font-size: 14px; color: #111827; font-weight: 600; width: 160px; vertical-align: top; border-bottom: 1px solid #e5e7eb;">{{ $document['label'] }}</td>
                                            <td style="padding: 10px 0; font-size: 14px; color: #374151; vertical-align: top; border-bottom: 1px solid #e5e7eb;">
                                                {{ $document['name'] }}
                                                @if($document['attached'])
                                                    <span style="display: block; font-size: 12px; color: #0d9488;">Attached</span>
                                                @elseif($savedInAttendance)
                                                    <span style="display: block; font-size: 12px; color: #b45309;">Not attached (email size limit). Open it in the attendance system.</span>
                                                @else
                                                    <span style="display: block; font-size: 12px; color: #b45309;">Not attached (email size limit). Saved on the website server: storage/app/private/{{ $document['stored_as'] }}</span>
                                                @endif
                                            </td>
                                        </tr>
                                        @endforeach
                                    </table>
                                @endif
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px 40px; text-align: center; border-radius: 0 0 4px 4px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                                Generated by Kisantra Recruitment System &bull; {{ date('Y') }}
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
