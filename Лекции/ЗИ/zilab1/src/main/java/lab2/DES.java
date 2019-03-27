package lab2;

import lombok.SneakyThrows;

public class DES {
    private static final DESKt cipher = DESKt.INSTANCE;
    private final String key;

    @SneakyThrows
    public DES(String key) {
        this.key = toHex(key);
    }

    @SneakyThrows
    public String encrypt(String s) {
        return cipher.encrypt(key, toHex(s));
    }

    @SneakyThrows
    public String decrypt(String s) {
        return fromHex(cipher.decrypt(key, s));
    }

    String toHex(String s) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            String x = String.format("%04X", (int) s.charAt(i));
            sb.append(x);
        }
        return sb.toString();
    }

    String fromHex(String s) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i += 4) {
            String x = "";
            for (int j = 0; j < 4; j++) x += s.charAt(i + j);
            sb.append((char) Integer.parseInt(x, 16));
        }
        return sb.toString();
    }
}