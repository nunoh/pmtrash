import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class Server {

	private static ServerSocket server;
	private static Socket socket;
	private static int port = 6000;
	private static String data = "some random message, trash boom bang!";
	private static String sKey = "somerandomkey123";

	public static void main(String args[]) throws Exception {

		// handling a SIGKILL signal to shutdown and close active connections
		Runtime.getRuntime().addShutdownHook(new Thread() {
			public void run() {
				try {
					server.close();
					socket.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		});

		// parsing command line arguments
		if (args.length != 1) {
			System.out.println("usage: java Server [port]");
			System.exit(1);
		}

		else {
			port = Integer.parseInt(args[0]);
		}

		System.out.println("serving on port: " + port);

		// encrypting data to send
		byte[] bKey = sKey.getBytes();
		byte[] dataToSend = data.getBytes();
		Cipher c = Cipher.getInstance("AES");
		SecretKeySpec k = new SecretKeySpec(bKey, "AES");
		c.init(Cipher.ENCRYPT_MODE, k);
		byte[] encryptedData = c.doFinal(dataToSend);
		String sEncrpyted = new String(encryptedData);

		
		try {
			
			// initialize a server socket connection
			server = new ServerSocket(port);
			socket = server.accept();
			
			while (true) {				
				// send encrypted data
				socket.getOutputStream().write(sEncrpyted.getBytes());
				// separate messages with a new line
				socket.getOutputStream().write("\n".getBytes());
				
				Thread.sleep(2000);
			}
		}

		catch (Exception e) {
			e.printStackTrace();
		}
	}
}