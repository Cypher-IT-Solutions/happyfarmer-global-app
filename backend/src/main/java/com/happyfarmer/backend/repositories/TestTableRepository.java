package com.happyfarmer.backend.repositories;

import com.happyfarmer.backend.models.TestTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestTableRepository extends JpaRepository<TestTable, Long> {}
