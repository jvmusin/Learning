package lab2;

public class Main {
    public static void main(String[] args) {
        testKotlinTripleDes();
    }

    private static void testMyTripleDes() {
        TripleDES tripleDES = new TripleDES("First Key", "Second Key", "Third Key");
        String message = "Hello, World!";
        String encrypted = tripleDES.encrypt(message);
        String decrypted = tripleDES.decrypt(encrypted);
        System.out.println(message);
        System.out.println(encrypted);
        System.out.println(decrypted);
    }

    private static void testKotlinTripleDes() {
        String message = "0123456789ABCDEF";
        final String key = "133457799BBCDFF1";
        final String encrypted = DES2.INSTANCE.encrypt(key, message);
        final String decrypted = DES2.INSTANCE.decrypt(key, encrypted);
        System.out.println(message);
        System.out.println(encrypted);
        System.out.println(decrypted);
    }
}