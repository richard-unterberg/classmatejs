/** @jsxImportSource solid-js */
import cm from "../../src"

const MyButton = cm.button<{ $toggleCta?: boolean }>`
  absolute
  ${({ $toggleCta }) => ($toggleCta ? "bg-red-500" : "bg-blue-500")}
`
;<MyButton type="button" $toggleCta />
;<MyButton $_as="span" $toggleCta />
// @ts-expect-error button-only props are not valid after transforming to span
;<MyButton $_as="span" $toggleCta type="button" />

const LinkButton = cm.transform(MyButton).a`
  ${({ href, $toggleCta }) => (href && $toggleCta ? "underline" : "")}
`
;<LinkButton href="/docs" $toggleCta />
// @ts-expect-error button-only props are not valid on transformed anchor
;<LinkButton disabled $toggleCta />

const SpanButton = cm.transform(MyButton).span
;<SpanButton $toggleCta />
// @ts-expect-error button-only props are not valid on transformed span
;<SpanButton type="button" $toggleCta />

const RegularComponent = (_props: { class?: string }) => <div />
// @ts-expect-error regular Solid components are not transformable
cm.transform(RegularComponent)
