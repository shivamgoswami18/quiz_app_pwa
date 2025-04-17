import BaseButton from "Components/Base/BaseButton";
import { DomainQuestionPreviewUIConstants } from "Components/constants/DomainQuestion";
import { useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  CardBody,
  CardHeader,
} from "reactstrap";

const DomainQuestionPreview = ({
  setIsDeleteModal,
  domainQuestionList,
  setSelectDeleteQuestionId,
  handleOpenModal,
  lastQuestionRef,
}: any) => {
  const [open, setOpen] = useState("-1");
  const toggle = (id: any) => {
    if (open === id) {
      setOpen("-1");
    } else {
      setOpen(id);
    }
  };

  return (
    <div>
      {domainQuestionList?.map((question: any, index: any) => (
        <div
          className="card"
          key={question._id}
          ref={index === domainQuestionList.length - 1 ? lastQuestionRef : null}
        >
          <Accordion open={open} toggle={toggle}>
            <AccordionItem>
              <AccordionHeader targetId={`${index}`}>
                <CardHeader className="border-0 text-black pt-0 pb-0">
                  <div>
                    <div className="d-flex align-items-start gap-2">
                      <p>{`${
                        DomainQuestionPreviewUIConstants.QForQuestionNumber
                      }${index + 1}${
                        DomainQuestionPreviewUIConstants.DotForQuestionNumber
                      }`}</p>
                      <div
                        className="mb-0 preview-question-style"
                        dangerouslySetInnerHTML={{
                          __html: `${question?.question}`,
                        }}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <BaseButton
                        className="btn btn-info d-flex justify-content-center align-content-center rounded-circle px-2 py-1"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          setSelectDeleteQuestionId(question?._id);
                          handleOpenModal("addEdit", question?._id);
                        }}
                      >
                        <i className="mdi mdi-pencil" />
                      </BaseButton>

                      <BaseButton
                        className={`btn btn-danger d-flex justify-content-center align-content-center rounded-circle px-2 py-1 ${
                          question?.is_draft
                            ? "opacity-25 pointer-events-none"
                            : ""
                        }`}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          if (!question?.is_draft) {
                            setIsDeleteModal(true);
                            setSelectDeleteQuestionId(question?._id);
                          }
                        }}
                      >
                        <i className="mdi mdi-delete" />
                      </BaseButton>
                    </div>
                  </div>
                </CardHeader>
              </AccordionHeader>
              <AccordionBody accordionId={`${index}`}>
                <CardBody className="p-0">
                  {question?.options?.map((option: any) => (
                    <p
                      key={`${question._id}-${option.option}`}
                      className={`ps-3 ${
                        option.is_correct
                          ? "bg-success text-white rounded-2 py-2"
                          : ""
                      }`}
                    >
                      {`${option.option}. ${option.description}`}
                    </p>
                  ))}
                </CardBody>
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default DomainQuestionPreview;
