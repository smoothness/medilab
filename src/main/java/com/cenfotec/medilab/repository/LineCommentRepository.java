package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.LineComment;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the LineComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LineCommentRepository extends JpaRepository<LineComment, Long> {
    @Query(
        value = "select line_comment.id, line_comment.description, line_comment.quantity, line_comment.unit_price, line_comment.invoice_code_id from line_comment inner join invoice on invoice.id = line_comment.invoice_code_id where line_comment.invoice_code_id = :id",
        nativeQuery = true
    )
    List<LineComment> findInvoiceLines(@Param("id") Long id);
}
