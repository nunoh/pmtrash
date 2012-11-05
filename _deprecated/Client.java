import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class Client {

	private static Socket socket;
	private static BufferedReader in; 
	private static int port = 6000;
	private static String address = "localhost";
	private static final String sKey = "somerandomkey123";

	public static void main(String args[]) {
		
		// handling a SIGKILL signal to shutdown and close active connections
		Runtime.getRuntime().addShutdownHook(new Thread() {
            public void run() {
                try {
					in.close();
					socket.close();
				} catch (IOException e) {
					e.printStackTrace();
				}                
            }
        });

		// parsing command line arguments
		if (args.length != 2) {
			System.out.println("usage: java Client [address] [port]");
			System.exit(1);
		}

		else {
			address = args[0];
			port = Integer.parseInt(args[1]);
		}

		System.out.println("server address: " + address);
		System.out.println("listening on port: " + port);

		try {
			// establish connection
			socket = new Socket(address, port);

			while (true) {
				// get encrypted bytes in socket
				byte[] bEncrypted = null;
				in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
				String sEncrypted = in.readLine();
				bEncrypted = sEncrypted.getBytes();

				// decrypt bytes received
				byte[] bKey = sKey.getBytes();
				Cipher chipher = Cipher.getInstance("AES");
				SecretKeySpec sks = new SecretKeySpec(bKey, "AES");
				chipher.init(Cipher.DECRYPT_MODE, sks);
				byte[] bDecrypted = chipher.doFinal(bEncrypted);

				// string with plain data
				String received = new String(bDecrypted);
				System.out.println("received: '" + received + "'");				
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
