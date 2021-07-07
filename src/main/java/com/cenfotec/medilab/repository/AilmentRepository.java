package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Ailment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ailment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AilmentRepository extends JpaRepository<Ailment, Long> {}
