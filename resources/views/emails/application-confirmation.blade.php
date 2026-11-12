<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Lamaran</title>
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
                        <td align="center" style="padding: 40px 40px 20px 40px;">
                            <img src="{{ $message->embed(public_path('image/Logo/OnlyLogo.png')) }}" alt="Kisantra Logo" style="width: 60px; height: auto; display: block;">
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            
                            <!-- Headline -->
                            <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 24px 0; text-align: center; letter-spacing: -0.5px;">
                                Lamaran Berhasil Terkirim
                            </h1>

                            <!-- Greeting -->
                            <p style="margin: 0 0 16px 0; font-size: 16px;">
                                Halo <strong>{{ $applicantName }}</strong>,
                            </p>
                            <p style="margin: 0 0 32px 0; font-size: 16px; color: #4b5563;">
                                Terima kasih telah melamar posisi <strong>{{ $jobTitle }}</strong> di PT Kisantra Indonesia. Kami telah menerima berkas lamaran Anda dengan baik.
                            </p>

                            <!-- Summary Details -->
                            <div style="border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 24px 0; margin-bottom: 32px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding: 4px 0; font-size: 14px; color: #6b7280; width: 140px;">Posisi Dilamar</td>
                                        <td style="padding: 4px 0; font-size: 14px; color: #111827; font-weight: 500;">{{ $jobTitle }}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 4px 0; font-size: 14px; color: #6b7280;">Tanggal Kirim</td>
                                        <td style="padding: 4px 0; font-size: 14px; color: #111827; font-weight: 500;">{{ now()->format('d F Y') }}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 4px 0; font-size: 14px; color: #6b7280;">Email Terdaftar</td>
                                        <td style="padding: 4px 0; font-size: 14px; color: #111827; font-weight: 500;">{{ $applicationData['applicant_email'] }}</td>
                                    </tr>
                                    @if(!empty($applicationData['documents']))
                                    <tr>
                                        <td style="padding: 4px 0; font-size: 14px; color: #6b7280; vertical-align: top;">Dokumen Diterima</td>
                                        <td style="padding: 4px 0; font-size: 14px; color: #111827; font-weight: 500;">
                                            @foreach($applicationData['documents'] as $document)
                                                <span style="display: block;">{{ $document['label'] }} <span style="color: #6b7280; font-weight: 400;">({{ $document['name'] }})</span></span>
                                            @endforeach
                                        </td>
                                    </tr>
                                    @endif
                                </table>
                            </div>

                            <!-- Next Steps -->
                            <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                                Langkah Selanjutnya
                            </h3>
                            <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563;">
                                Tim Talent Acquisition kami akan meninjau profil dan kualifikasi Anda. Banyak kandidat berkualitas yang melamar untuk posisi ini, sehingga proses seleksi administrasi membutuhkan waktu sekitar <strong>7-14 hari kerja</strong>.
                            </p>
                            <p style="margin: 0 0 32px 0; font-size: 15px; color: #4b5563;">
                                Jika profil Anda sesuai dengan kebutuhan kami saat ini, kami akan menghubungi Anda melalui email atau telepon untuk tahapan selanjutnya.
                            </p>

                            <!-- Contact Support -->
                            <p style="margin: 0; font-size: 14px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 24px;">
                                Ada pertanyaan? Hubungi kami di <a href="mailto:kisantra.official@gmail.com" style="color: #0d9488; text-decoration: none;">kisantra.official@gmail.com</a>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-radius: 0 0 4px 4px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                PT Kisantra Indonesia
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                &copy; {{ date('Y') }} Kisantra Group. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
                <!-- End Email Container -->

                <p style="margin: 24px 0 0 0; font-size: 11px; color: #9ca3af; text-align: center;">
                    Anda menerima email ini karena telah melamar pekerjaan di website resmi Kisantra.
                </p>

            </td>
        </tr>
    </table>

</body>
</html>