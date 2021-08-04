package com.cenfotec.medilab.service.impl;

import com.cenfotec.medilab.domain.LineComment;
import com.cenfotec.medilab.repository.LineCommentRepository;
import com.cenfotec.medilab.service.LineCommentService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link LineComment}.
 */
@Service
@Transactional
public class LineCommentServiceImpl implements LineCommentService {

    private final Logger log = LoggerFactory.getLogger(LineCommentServiceImpl.class);

    private final LineCommentRepository lineCommentRepository;

    public LineCommentServiceImpl(LineCommentRepository lineCommentRepository) {
        this.lineCommentRepository = lineCommentRepository;
    }

    @Override
    public LineComment save(LineComment lineComment) {
        log.debug("Request to save LineComment : {}", lineComment);
        return lineCommentRepository.save(lineComment);
    }

    @Override
    public Optional<LineComment> partialUpdate(LineComment lineComment) {
        log.debug("Request to partially update LineComment : {}", lineComment);

        return lineCommentRepository
            .findById(lineComment.getId())
            .map(
                existingLineComment -> {
                    if (lineComment.getDescription() != null) {
                        existingLineComment.setDescription(lineComment.getDescription());
                    }
                    if (lineComment.getQuantity() != null) {
                        existingLineComment.setQuantity(lineComment.getQuantity());
                    }
                    if (lineComment.getUnitPrice() != null) {
                        existingLineComment.setUnitPrice(lineComment.getUnitPrice());
                    }

                    return existingLineComment;
                }
            )
            .map(lineCommentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LineComment> findAll() {
        log.debug("Request to get all LineComments");
        return lineCommentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LineComment> findOne(Long id) {
        log.debug("Request to get LineComment : {}", id);
        return lineCommentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete LineComment : {}", id);
        lineCommentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LineComment> findInvoiceLines(Long id) {
        return lineCommentRepository.findInvoiceLines(id);
    }
}
