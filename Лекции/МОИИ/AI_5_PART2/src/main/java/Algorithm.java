package main.java;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

class Algorithm {
    private static final int ENTITY_COUNT = 14;
    private static final List<String> PROPERTIES = Arrays.asList(
            "Кредитная история",
            "Долг",
            "Поручительство",
            "Доход"
    );

    Algorithm() {
        try {
            Scanner in;
            List<Entity> entities = new ArrayList<>(ENTITY_COUNT);
            in = new Scanner(Paths.get("examples.txt"));
            for (int i = 0; i < ENTITY_COUNT; i++)
                entities.add(Entity.read(in));
            in = new Scanner(Paths.get("answers.txt"));
            for (int i = 0; i < ENTITY_COUNT; i++)
                entities.get(i).answer = in.next();

            Vertex root = new Vertex();
            buildTree(entities, root);
            root.print(0);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void buildTree(List<Entity> activeEntities, Vertex vertex) {
        if (groupByAnswer(activeEntities).size() == 1) {
            vertex.name = activeEntities.get(0).answer;
            return;
        }

        String maxInformativityProperty = PROPERTIES.stream()
                .filter(p -> activeEntities.stream().map(e -> e.properties.get(p)).distinct().count() > 1)
                .max(Comparator.comparingDouble(p -> calculatePropertyInformativity(activeEntities, p)))
                .orElse(null);

        vertex.name = String.format("%s %.10f", maxInformativityProperty, calculatePropertyInformativity(activeEntities, maxInformativityProperty));

        groupByPropertyValue(activeEntities, maxInformativityProperty).forEach((value, entities) -> {
            Vertex nextVertex = new Vertex();
            vertex.adj.add(new Edge(value, nextVertex));
            buildTree(entities, nextVertex);
        });
    }

    private Map<String, List<Entity>> groupByPropertyValue(List<Entity> entities, String propertyName) {
        return entities.stream()
                .collect(Collectors.groupingBy(e -> e.properties.get(propertyName)));
    }

    private Map<String, List<Entity>> groupByAnswer(List<Entity> entities) {
        return entities.stream()
                .collect(Collectors.groupingBy(e -> e.answer));
    }

    private double log2(double x) {
        return Math.log(x) / Math.log(2);
    }

    private double calculateAnswersInformativity(List<Entity> entities) {
        return -groupByAnswer(entities).values().stream()
                .mapToDouble(curEntities -> (double) curEntities.size() / entities.size())
                .map(x -> x * log2(x))
                .sum();
    }

    private double calculatePropertyInformativity(List<Entity> entities, String propertyName) {
        return calculateAnswersInformativity(entities) - groupByPropertyValue(entities, propertyName).values().stream()
                .mapToDouble(cur -> calculateAnswersInformativity(cur) * cur.size() / entities.size())
                .sum();
    }

    static class Entity {
        String answer;
        Map<String, String> properties;

        Entity(Map<String, String> properties) {
            this.properties = properties;
        }

        static Entity read(Scanner in) {
            return new Entity(PROPERTIES.stream()
                    .collect(Collectors.toMap(Function.identity(), p -> in.next())));
        }
    }

    class Vertex {
        String name;
        List<Edge> adj = new ArrayList<>();

        void print(int depth) {
            for (int i = 0; i < depth; i++) System.out.print("  ");
            System.out.println(name.toUpperCase());
            for (Edge e : adj) {
                for (int i = 0; i < depth; i++) System.out.print("  ");
                System.out.println(" " + e.value);
                e.to.print(depth + 1);
            }
        }
    }

    class Edge {
        String value;
        Vertex to;

        Edge(String value, Vertex to) {
            this.value = value;
            this.to = to;
        }
    }
}