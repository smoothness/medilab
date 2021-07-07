package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.EmergencyContact;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EmergencyContact entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {}
