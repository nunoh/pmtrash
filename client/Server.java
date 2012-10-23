import java.lang.*;
import java.io.*;
import java.net.*;

public class Server {

	private static int port = 6000;
	private static String data = "hello message from server";

	public static void main(String args[]) {
		
		if (args.length != 1) {
			System.out.println("usage: java Server [port]");
			System.exit(1);
		}
		
		else {
			port = Integer.parseInt(args[0]);
		}
		
		System.out.println("listening on port: " + port);

		try {
			ServerSocket srvr = new ServerSocket(port);
			Socket skt = srvr.accept();

			System.out.print("client connected!\n");

			PrintWriter out = new PrintWriter(skt.getOutputStream(), true);
			System.out.print("sending: '" + data + "'");
			out.print(data);

			out.close();
			skt.close();
			srvr.close();
		}

		catch (Exception e) {
			e.printStackTrace();
		}
	}
}