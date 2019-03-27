package musin.zi.lab1;

public class TranspositionCipher {

    public String encode(String text, String key) {
        return process(text, key, false);
    }

    public String decode(String text, String key) {
        return process(text, key, true);
    }

    private String process(String text, String key, boolean decode) {
        System.out.printf("Обработка строки \"%s\" ключом \"%s\", %s\n",
                text, key, decode ? "расшифровка" : "шифровка");
        char[][] a = toTable(text, key.length());
        print("Начальная матрица:", a);
        int[] compressed = compress(key);
        int[] order = index(compressed);
        if (decode) order = index(order);
        char[][] b = new char[a.length][a[0].length];
        for (int i = 0; i < key.length(); i++)
            copyColumn(a, b, order[i], i);
        print("Конечная матрица:", b);
        String result = toString(b);
        System.out.printf("Результат: \"%s\"\n", result);
        System.out.println("---");
        return result;
    }

    private int[] compress(String key) {
        int[] res = new int[key.length()];
        for (int i = 0; i < key.length(); i++)
            for (int j = 0; j < key.length(); j++)
                if (key.charAt(j) < key.charAt(i))
                    res[i]++;
        return res;
    }

    private int[] index(int[] p) {
        int[] index = new int[p.length];
        for (int i = 0; i < p.length; i++) index[p[i]] = i;
        return index;
    }

    private char[][] toTable(String s, int keyLen) {
        int n = (s.length() + keyLen - 1) / keyLen;
        char[][] a = new char[n][keyLen];
        for (int i = 0; i < n * keyLen; i++)
            a[i % n][i / n] = i < s.length() ? s.charAt(i) : ' ';
        return a;
    }

    private String toString(char[][] a) {
        int n = a.length;
        int m = a[0].length;
        StringBuilder sb = new StringBuilder(n * m);
        for (int j = 0; j < m; j++)
            for (int i = 0; i < n; i++)
                sb.append(a[i][j]);
        return sb.toString();
    }

    private void copyColumn(char[][] from,
                            char[][] to,
                            int fromCol,
                            int toCol) {
        for (int i = 0; i < from.length; i++)
            to[i][toCol] = from[i][fromCol];
    }

    private void print(String name, Object a) {
        System.out.println(name);
        if (a instanceof char[][]) print((char[][]) a);
        else System.out.println(a);
    }

    private void print(char[][] a) {
        for (char[] row : a)
            System.out.println(new String(row));
    }
}