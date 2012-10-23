import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.Socket;

public class Client {

	private static int port = 6000;
	private static String address = "localhost";

	public static void main(String args[]) {
		
		if (args.length != 2) {
			System.out.println("usage: java Client [address] [port]");
			System.exit(1);
		}
		
		else {
			address = args[0];
			port = Integer.parseInt(args[1]);			
		}
		
		System.out.println("sending to address: " + address);
		System.out.println("on port: " + port);

		try {
			
			Socket skt = new Socket(address, port);
			
			BufferedReader in = new BufferedReader(new InputStreamReader(skt.getInputStream()));
			System.out.print("received: '");

			while (!in.ready()) { }
			
			System.out.print(in.readLine() + "'");

			in.close();
		
		} catch (Exception e) {
			System.err.println("error: was server launched first?");
		}
	}
}