import { DocsHead } from "#components/DocsHead"
import HighlighterComponent from "#components/HighlighterComponent"
import CodeElement from "#components/common/CodeElement"
import LinkComponent from "#components/common/LinkComponent"
import { Section, SectionHeadline, SectionInnerHeadline, SectionInnerParagraph } from "#docs/elements"
import { internalLink } from "#lib/links"

import basic from "#docs/variants/code/basic.rcx"
import basicImplementation from "#docs/variants/code/basicImplementation.rcx"

const DocsStartPage = () => {
  return (
    <>
      <DocsHead
        main="Variants"
        pre="Keep it together"
        excerpt={
          <>
            This function allows you to create a styled component with different variants based on the props
            you pass to it.
          </>
        }
      />
      <SectionHeadline>Basic syntax</SectionHeadline>
      <Section>
        <HighlighterComponent input={basic} />
        <SectionInnerHeadline>The function receives the following properties:</SectionInnerHeadline>
        <ul className="mb-4">
          <li>
            <CodeElement>base</CodeElement> - optional - The base classname of the component
          </li>
          <li>
            <CodeElement>variants</CodeElement> - required - An object with the different variants
          </li>
          <li>
            <CodeElement>defaultVariants</CodeElement> - optional - a fallback for when no variant is passed
          </li>
        </ul>
        <SectionInnerHeadline>Implementation</SectionInnerHeadline>
        <HighlighterComponent input={basicImplementation} />
        <SectionInnerParagraph>
          Need to reuse a component but still expose a variant API? Chain{" "}
          <CodeElement>cm.extend().variants</CodeElement>
          so the base template literal styles stay intact while consumers get declarative variant props. Learn
          more on the
          <LinkComponent href={internalLink.docs.extend} className="ml-1">
            extend page
          </LinkComponent>
          .
        </SectionInnerParagraph>
      </Section>
    </>
  )
}

export default DocsStartPage
