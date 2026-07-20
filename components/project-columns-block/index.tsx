import ColumnBlock from '@/components/column-block'
import type { ProjectColumnsBlockProps } from '@/types/components/project-columns-block-type'

/** @deprecated Prefer columnBlock (Cards) with cardStyle="project". Dual-render alias. */
export default function ProjectColumnsBlock(props: ProjectColumnsBlockProps) {
  return (
    <ColumnBlock
      {...props}
      cardStyle="project"
      columns={props.projects}
    />
  )
}
