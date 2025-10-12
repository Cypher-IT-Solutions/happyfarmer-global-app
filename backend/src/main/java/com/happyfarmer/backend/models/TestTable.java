package com.happyfarmer.backend.models;

import jakarta.persistence.*;

@Entity                // Makes this a database-mapped class
@Table(name = "testtable") // Tells Hibernate the table name
public class TestTable {
    @Id                              // This field is the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment
    private Long id;

    private String value;            // Maps to the 'value' column

    // Getters and setters (JavaBean standard)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}
