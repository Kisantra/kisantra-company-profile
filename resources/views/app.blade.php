<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1029180543162164');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=1029180543162164&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->

    <!-- SEO Meta Tags -->
    <meta name="description" content="Kisantra Consult — konsultan pajak, keuangan, dan bisnis terpercaya di Samarinda, Kalimantan Timur. Layanan perpajakan (SPT, PPN, PPh), audit keuangan, legalitas usaha (NPWP, PKP, PT/CV), dan transformasi digital.">
    <meta name="keywords" content="Konsultan Pajak Samarinda, Jasa Pajak Samarinda, Konsultan Keuangan Samarinda, Audit Keuangan Samarinda, Konsultan Bisnis Kaltim, Jasa NPWP PKP Samarinda, Kisantra Consult">
    <meta name="author" content="Kisantra Consult">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Local / Geo -->
    <meta name="geo.region" content="ID-KI">
    <meta name="geo.placename" content="Samarinda, Kalimantan Timur">
    <meta name="geo.position" content="-0.4805135;117.1249195">
    <meta name="ICBM" content="-0.4805135, 117.1249195">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:locale" content="id_ID">
    <meta property="og:site_name" content="Kisantra Consult">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="Kisantra Consult — Konsultan Pajak & Keuangan Samarinda">
    <meta property="og:description" content="Mitra strategis perpajakan, keuangan, dan transformasi digital bisnis di Samarinda dan Kalimantan Timur.">
    <meta property="og:image" content="{{ asset('image/Logo/OnlyLogo.png') }}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ url()->current() }}">
    <meta property="twitter:title" content="Kisantra Consult — Konsultan Pajak & Keuangan Samarinda">
    <meta property="twitter:description" content="Mitra strategis perpajakan, keuangan, dan transformasi digital bisnis di Samarinda dan Kalimantan Timur.">
    <meta property="twitter:image" content="{{ asset('image/Logo/OnlyLogo.png') }}">

    <title inertia>Kisantra Consult — Konsultan Pajak & Keuangan Samarinda</title>

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('image/Logo/OnlyLogo.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('image/Logo/OnlyLogo.png') }}">

    <!-- LocalBusiness structured data (JSON-LD) -->
    @php
        $kisantraLd = [
            '@context' => 'https://schema.org',
            '@type' => ['AccountingService', 'ProfessionalService'],
            'name' => 'Kisantra Consult',
            '@id' => url('/') . '#organization',
            'url' => url('/'),
            'image' => asset('image/Logo/OnlyLogo.png'),
            'logo' => asset('image/Logo/OnlyLogo.png'),
            'telephone' => '+6281180009787',
            'email' => 'kisantra.official@gmail.com',
            'priceRange' => '$$',
            'description' => 'Konsultan pajak, keuangan, dan bisnis terpercaya di Samarinda, Kalimantan Timur.',
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => 'Jln. Suryanta, Gg. Kopta, Air Putih, Kec. Samarinda Ulu',
                'addressLocality' => 'Samarinda',
                'addressRegion' => 'Kalimantan Timur',
                'postalCode' => '75243',
                'addressCountry' => 'ID',
            ],
            'geo' => ['@type' => 'GeoCoordinates', 'latitude' => -0.4805135, 'longitude' => 117.1249195],
            'hasMap' => 'https://maps.app.goo.gl/uruyuiRPund8uwAm7',
            'areaServed' => ['Samarinda', 'Kalimantan Timur'],
            'sameAs' => ['https://www.instagram.com/kisantra.official/'],
            'openingHoursSpecification' => [
                ['@type' => 'OpeningHoursSpecification', 'dayOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 'opens' => '08:00', 'closes' => '17:00'],
                ['@type' => 'OpeningHoursSpecification', 'dayOfWeek' => 'Saturday', 'opens' => '09:00', 'closes' => '13:00'],
            ],
        ];
    @endphp
    <script type="application/ld+json">{!! json_encode($kisantraLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Fonts -->
    <!-- <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet"> -->

    <!-- Scripts -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="antialiased">
    @inertia
</body>
</html>
