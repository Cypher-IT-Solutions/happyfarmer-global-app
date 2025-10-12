package com.happyfarmer.backend.controllers;

import com.happyfarmer.backend.models.TestTable;
import com.happyfarmer.backend.services.TestTableService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TestTableController {
    private final TestTableService service;
    public TestTableController(TestTableService service) { this.service = service; }
    @GetMapping("/api/testtable")
    public List<TestTable> getAll() { return service.getAll(); }
}
