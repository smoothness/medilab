package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Binnacle;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Binnacle entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BinnacleRepository extends JpaRepository<Binnacle, Long> {}
