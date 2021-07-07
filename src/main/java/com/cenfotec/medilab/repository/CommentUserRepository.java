package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.CommentUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CommentUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommentUserRepository extends JpaRepository<CommentUser, Long> {}
