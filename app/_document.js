import Document, { Html, Head, Main, NextScript } from "next/document";
export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="shortcut icon" 
                        href="/logo.png"
                        type="image/x-icon" />
                        <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
                    <script>

                    // Enable pusher logging - don't include this in production
                    Pusher.logToConsole = true;

                    var pusher = new Pusher('ba1ec0d23f304fedd67d', {
                        cluster: 'sa1'
                    });

                    var channel = pusher.subscribe('my-channel');
                    channel.bind('my-event', function(data) {
                        alert(JSON.stringify(data));
                    });
                    </script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}