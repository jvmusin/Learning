package musin.zi.lab1;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        sample();
        String text = readLine("Введите строку для шифровки/расшифроки: ");
        String key = readLine("Введите ключ: ");
        String type = readLine("Зашифровать (encrypt) или расшифрокать (decrypt): ");
        if (type.equals("encrypt")) {
            new TranspositionCipher().encode(text, key);
        } else {
            new TranspositionCipher().decode(text, key);
        }
    }

    private static Scanner in = new Scanner(System.in);

    private static String readLine(String toPrint) {
        System.out.print(toPrint);
        return in.nextLine();
    }

    private static void sample() {
        TranspositionCipher cipher = new TranspositionCipher();
        String text = "Привет, как дела?";
        String key = "такое";
        String res = cipher.encode(text, key);
        cipher.decode(res, key);
    }
}