package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.LineComment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the LineComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LineCommentRepository extends JpaRepository<LineComment, Long> {}
