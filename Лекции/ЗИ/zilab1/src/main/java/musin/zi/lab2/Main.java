package musin.zi.lab2;

public class Main {
    public static void main(String[] args) {
        TripleDES tripleDES = new TripleDES("First Key", "Second Key", "Third Key");
        String message = "Hello, World!";
        String encoded = tripleDES.encode(message);
        String decoded = tripleDES.decode(encoded);
        System.out.println(message);
        System.out.println(encoded);
        System.out.println(decoded);
    }
}