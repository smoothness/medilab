package com.cenfotec.medilab.service.impl;

import com.cenfotec.medilab.domain.CommentUser;
import com.cenfotec.medilab.repository.CommentUserRepository;
import com.cenfotec.medilab.service.CommentUserService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link CommentUser}.
 */
@Service
@Transactional
public class CommentUserServiceImpl implements CommentUserService {

    private final Logger log = LoggerFactory.getLogger(CommentUserServiceImpl.class);

    private final CommentUserRepository commentUserRepository;

    public CommentUserServiceImpl(CommentUserRepository commentUserRepository) {
        this.commentUserRepository = commentUserRepository;
    }

    @Override
    public CommentUser save(CommentUser commentUser) {
        log.debug("Request to save CommentUser : {}", commentUser);
        return commentUserRepository.save(commentUser);
    }

    @Override
    public Optional<CommentUser> partialUpdate(CommentUser commentUser) {
        log.debug("Request to partially update CommentUser : {}", commentUser);

        return commentUserRepository
            .findById(commentUser.getId())
            .map(
                existingCommentUser -> {
                    return existingCommentUser;
                }
            )
            .map(commentUserRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentUser> findAll() {
        log.debug("Request to get all CommentUsers");
        return commentUserRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CommentUser> findOne(Long id) {
        log.debug("Request to get CommentUser : {}", id);
        return commentUserRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete CommentUser : {}", id);
        commentUserRepository.deleteById(id);
    }
}
