package com.cenfotec.medilab.web.rest;

import com.cenfotec.medilab.domain.LineComment;
import com.cenfotec.medilab.repository.LineCommentRepository;
import com.cenfotec.medilab.service.LineCommentService;
import com.cenfotec.medilab.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.cenfotec.medilab.domain.LineComment}.
 */
@RestController
@RequestMapping("/api")
public class LineCommentResource {

    private final Logger log = LoggerFactory.getLogger(LineCommentResource.class);

    private static final String ENTITY_NAME = "lineComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LineCommentService lineCommentService;

    private final LineCommentRepository lineCommentRepository;

    public LineCommentResource(LineCommentService lineCommentService, LineCommentRepository lineCommentRepository) {
        this.lineCommentService = lineCommentService;
        this.lineCommentRepository = lineCommentRepository;
    }

    /**
     * {@code POST  /line-comments} : Create a new lineComment.
     *
     * @param lineComment the lineComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lineComment, or with status {@code 400 (Bad Request)} if the lineComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/line-comments")
    public ResponseEntity<LineComment> createLineComment(@RequestBody LineComment lineComment) throws URISyntaxException {
        log.debug("REST request to save LineComment : {}", lineComment);
        if (lineComment.getId() != null) {
            throw new BadRequestAlertException("A new lineComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LineComment result = lineCommentService.save(lineComment);
        return ResponseEntity
            .created(new URI("/api/line-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /line-comments/:id} : Updates an existing lineComment.
     *
     * @param id the id of the lineComment to save.
     * @param lineComment the lineComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lineComment,
     * or with status {@code 400 (Bad Request)} if the lineComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lineComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/line-comments/{id}")
    public ResponseEntity<LineComment> updateLineComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LineComment lineComment
    ) throws URISyntaxException {
        log.debug("REST request to update LineComment : {}, {}", id, lineComment);
        if (lineComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lineComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lineCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LineComment result = lineCommentService.save(lineComment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lineComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /line-comments/:id} : Partial updates given fields of an existing lineComment, field will ignore if it is null
     *
     * @param id the id of the lineComment to save.
     * @param lineComment the lineComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lineComment,
     * or with status {@code 400 (Bad Request)} if the lineComment is not valid,
     * or with status {@code 404 (Not Found)} if the lineComment is not found,
     * or with status {@code 500 (Internal Server Error)} if the lineComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/line-comments/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<LineComment> partialUpdateLineComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LineComment lineComment
    ) throws URISyntaxException {
        log.debug("REST request to partial update LineComment partially : {}, {}", id, lineComment);
        if (lineComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lineComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lineCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LineComment> result = lineCommentService.partialUpdate(lineComment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lineComment.getId().toString())
        );
    }

    /**
     * {@code GET  /line-comments} : get all the lineComments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lineComments in body.
     */
    @GetMapping("/line-comments")
    public List<LineComment> getAllLineComments() {
        log.debug("REST request to get all LineComments");
        return lineCommentService.findAll();
    }

    /**
     * {@code GET  /line-comments/:id} : get the "id" lineComment.
     *
     * @param id the id of the lineComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lineComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/line-comments/{id}")
    public ResponseEntity<LineComment> getLineComment(@PathVariable Long id) {
        log.debug("REST request to get LineComment : {}", id);
        Optional<LineComment> lineComment = lineCommentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(lineComment);
    }

    /**
     * {@code DELETE  /line-comments/:id} : delete the "id" lineComment.
     *
     * @param id the id of the lineComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/line-comments/{id}")
    public ResponseEntity<Void> deleteLineComment(@PathVariable Long id) {
        log.debug("REST request to delete LineComment : {}", id);
        lineCommentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
