//package main.java;
//
//import javafx.scene.Parent;
//import javafx.scene.canvas.Canvas;
//import javafx.scene.canvas.GraphicsContext;
//import javafx.scene.layout.Pane;
//import javafx.scene.paint.Color;
//
//class Controller {
//
//    private static final double WIDTH = 900;
//    private static final double HEIGHT = 600;
//
//    private final Algorithm algorithm = new Algorithm();
//    private final Canvas canvas = new Canvas(WIDTH, HEIGHT);
//    private GraphicsContext gc;
//
//    private double offset;
//
//    Controller() {
//        initialize();
//    }
//
//    private void initialize() {
//        gc = canvas.getGraphicsContext2D();
//        gc.setLineWidth(1);
//        gc.setStroke(Color.BLACK);
//        gc.setFill(Color.BLUE);
//        offset = 0;
//        draw("1", 20, 0);
//    }
//
//    private void draw(String vertex, double parentX, double parentY) {
//        double basedX = parentX, basedY = parentY + 80;
//        double step = 90;
//        double width = 70, height = 30;
//        gc.strokePolygon(
//                new double[]{basedX, basedX + width, basedX + width, basedX},
//                new double[]{basedY, basedY, basedY + height, basedY + height},
//                4
//        );
//        String[] verticesNames = vertex.split("-");
//        gc.strokeText(vertex.equals("1") ? "Доход" : verticesNames[verticesNames.length - 1], basedX + 5, basedY + 25);
//        if (algorithm.attributes.get(vertex) == null)
//            return;
//        if (algorithm.attributes.get(vertex).size() == 1) {
//            draw(algorithm.attributes.get(vertex).get(0), basedX, basedY);
//            return;
//        }
//        if (vertex.equals("1-50"))
//            offset -= step * 3;
//        for (String currentVertex : algorithm.attributes.get(vertex)) {
//            draw(currentVertex, offset + basedX, basedY);
//            basedX += step;
//        }
//        offset += step * (algorithm.attributes.get(vertex).size() - 1);
//    }
//
//    Parent asParent() {
//        return new Pane(canvas);
//    }
//}
