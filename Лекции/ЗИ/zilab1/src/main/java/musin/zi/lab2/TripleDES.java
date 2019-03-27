package musin.zi.lab2;

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
        return des3.encrypt(des2.encrypt(des1.encrypt(s)));
    }

    public String decode(String s) {
        return des1.decrypt(des2.decrypt(des3.decrypt(s)));
    }
}