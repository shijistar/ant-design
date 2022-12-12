import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import classNames from 'classnames';
import RcSteps from 'rc-steps';
import type { ProgressDotRender } from 'rc-steps/lib/Steps';
import * as React from 'react';
import { ConfigContext } from '../config-provider';
import useBreakpoint from '../grid/hooks/useBreakpoint';
import Progress from '../progress';
import { copyWithStatic } from '../_util/gdcd';

interface AntStepsProps {
  type?: 'default' | 'navigation';
  className?: string;
  current?: number;
  direction?: 'horizontal' | 'vertical';
  iconPrefix?: string;
  initial?: number;
  labelPlacement?: 'horizontal' | 'vertical';
  prefixCls?: string;
  progressDot?: boolean | ProgressDotRender;
  responsive?: boolean;
  size?: 'default' | 'small';
  status?: 'wait' | 'process' | 'finish' | 'error';
  style?: React.CSSProperties;
  percent?: number;
  onChange?: (current: number) => void;
  children?: React.ReactNode;
}
export type StepsProps = AntStepsProps & {
  /** StepItem之间的最大间距，像素 */
  maxGap?: number;
};

export interface StepProps {
  className?: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  status?: 'wait' | 'process' | 'finish' | 'error';
  disabled?: boolean;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  style?: React.CSSProperties;
}

interface StepsType extends React.FC<StepsProps> {
  Step: typeof RcSteps.Step;
}

const Steps: StepsType = props => {
  const {
    percent,
    size,
    className,
    direction,
    responsive = true,
    current = 0,
    ...restProps
  } = props;
  const { xs } = useBreakpoint(responsive);
  const { getPrefixCls, direction: rtlDirection } = React.useContext(ConfigContext);

  const getDirection = React.useCallback(
    () => (responsive && xs ? 'vertical' : direction),
    [xs, direction],
  );

  const prefixCls = getPrefixCls('steps', props.prefixCls);
  const iconPrefix = getPrefixCls('', props.iconPrefix);
  const stepsClassName = classNames(
    {
      [`${prefixCls}-rtl`]: rtlDirection === 'rtl',
      [`${prefixCls}-with-progress`]: percent !== undefined,
    },
    className,
  );
  const icons = {
    finish: <CheckOutlined className={`${prefixCls}-finish-icon`} />,
    error: <CloseOutlined className={`${prefixCls}-error-icon`} />,
  };
  const stepIconRender = ({
    node,
    status,
  }: {
    node: React.ReactNode;
    index: number;
    status: string;
    title: string | React.ReactNode;
    description: string | React.ReactNode;
  }) => {
    if (status === 'process' && percent !== undefined) {
      // currently it's hard-coded, since we can't easily read the actually width of icon
      const progressWidth = size === 'small' ? 32 : 40;
      const iconWithProgress = (
        <div className={`${prefixCls}-progress-icon`}>
          <Progress
            type="circle"
            percent={percent}
            width={progressWidth}
            strokeWidth={4}
            format={() => null}
          />
          {node}
        </div>
      );
      return iconWithProgress;
    }
    return node;
  };
  return (
    <RcSteps
      icons={icons}
      {...restProps}
      current={current}
      size={size}
      direction={getDirection()}
      stepIcon={stepIconRender}
      prefixCls={prefixCls}
      iconPrefix={iconPrefix}
      className={stepsClassName}
    />
  );
};

Steps.Step = RcSteps.Step;

const GDCDSteps: React.FC<StepsProps> = props => {
  const { maxGap, className, style, children, ...antProps } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const childCount = React.useMemo(() => {
    return React.Children.toArray(children).filter(
      child => React.isValidElement(child) && child.type === Steps.Step,
    ).length;
  }, [children]);
  const isMaxWidthMode = maxGap && childCount;

  // 给title和description添加title属性
  const [childSteps, setChildSteps] = React.useState<React.ReactNode[]>();
  React.useEffect(() => {
    setChildSteps(
      React.Children.toArray(children).map(child => {
        if (React.isValidElement(child) && child.type === Steps.Step) {
          const { title, description } = child.props;
          return React.cloneElement(child, {
            ...child.props,
            title: title && <span title={title}>{title}</span>,
            description: description && <span title={description}>{description}</span>,
          });
        } else {
          return child;
        }
      }),
    );
  }, [children]);

  return (
    <Steps
      className={classNames(
        className,
        isMaxWidthMode && getPrefixCls('steps-max-width-mode', antProps.prefixCls),
      )}
      style={{
        ...style,
        // 116 = 最末步骤的宽度（见style/label-placement.less）
        maxWidth: maxGap && childCount ? maxGap * (childCount - 1) + 116 : undefined,
      }}
      children={childSteps}
      {...antProps}
    />
  );
};

export default copyWithStatic(Steps, GDCDSteps);
