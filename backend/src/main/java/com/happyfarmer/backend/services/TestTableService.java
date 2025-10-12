package com.happyfarmer.backend.services;

import com.happyfarmer.backend.models.TestTable;
import com.happyfarmer.backend.repositories.TestTableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestTableService {
    private final TestTableRepository repo;
    public TestTableService(TestTableRepository repo) { this.repo = repo; }
    public List<TestTable> getAll() { return repo.findAll(); }
}
