package musin.zi.lab2;

import java.util.Base64;

import static java.nio.charset.StandardCharsets.UTF_8;

public class TripleDES {
    private final DES des1;
    private final DES des2;
    private final DES des3;

    public TripleDES() {
        des1 = new DES();
        des2 = new DES();
        des3 = new DES();
    }

    public String encode(String s) {
        byte[] bytes = s.getBytes(UTF_8);
        byte[] res = des3.encrypt(des2.encrypt(des1.encrypt(bytes)));
        byte[] b64 = Base64.getEncoder().encode(res);
        return new String(b64, UTF_8);
    }

    public String decode(String s) {
        byte[] bytes = Base64.getDecoder().decode(s);
        byte[] res = des1.decrypt(des2.decrypt(des3.decrypt(bytes)));
        return new String(res, UTF_8);
    }
}