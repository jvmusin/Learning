package lab2;

public class Main {
    public static void main(String[] args) {
        testMyTripleDes();
    }

    private static void testMyTripleDes() {
        TripleDES tripleDES = new TripleDES("First Key", "Second Key", "Third Key");
        String message = "Hello, World!";
        String encrypted = tripleDES.encrypt(message);
        String decrypted = tripleDES.decrypt(encrypted);
        System.out.printf("Initial message is '%s'\n", message);
        System.out.printf("Encrypted message is '%s'\n", encrypted);
        System.out.printf("Decrypted message is '%s'\n", decrypted);
    }
}