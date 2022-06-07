// Styles
import './VBtn.sass'

// Components
import { VBtnToggleSymbol } from '@/components/VBtnToggle/VBtnToggle'
import { VIcon } from '@/components/VIcon'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeGroupItemProps, useGroupItem } from '@/composables/group'
import { makeLocationProps, useLocation } from '@/composables/location'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeRouterProps, useLink } from '@/composables/router'
import { makeSizeProps, useSize } from '@/composables/size'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { genOverlays, makeVariantProps, useVariant } from '@/composables/variant'
import { useSelectLink } from '@/composables/selectLink'
import { IconValue } from '@/composables/icons'

// Directives
import { Ripple } from '@/directives/ripple'

// Utilities
import { computed } from 'vue'
import { defineComponent, useRender } from '@/util'

// Types
import type { PropType } from 'vue'

export const VBtn = defineComponent({
  name: 'VBtn',

  directives: { Ripple },

  props: {
    active: Boolean,
    symbol: {
      type: null,
      default: VBtnToggleSymbol,
    },
    flat: Boolean,
    icon: [Boolean, String, Function, Object] as PropType<boolean | IconValue>,
    prependIcon: IconValue,
    appendIcon: IconValue,

    block: Boolean,
    stacked: Boolean,

    ripple: {
      type: Boolean,
      default: true,
    },

    ...makeBorderProps(),
    ...makeRoundedProps(),
    ...makeDensityProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeGroupItemProps(),
    ...makeLocationProps(),
    ...makePositionProps(),
    ...makeRouterProps(),
    ...makeSizeProps(),
    ...makeTagProps({ tag: 'button' }),
    ...makeThemeProps(),
    ...makeVariantProps({ variant: 'contained' } as const),
  },

  setup (props, { attrs, slots }) {
    const { themeClasses } = provideTheme(props)
    const { borderClasses } = useBorder(props)
    const { colorClasses, colorStyles, variantClasses } = useVariant(props)
    const { densityClasses } = useDensity(props)
    const { dimensionStyles } = useDimension(props)
    const { elevationClasses } = useElevation(props)
    const { locationStyles } = useLocation(props)
    const { positionClasses } = usePosition(props)
    const { roundedClasses } = useRounded(props)
    const { sizeClasses } = useSize(props)
    const group = useGroupItem(props, props.symbol, false)
    const link = useLink(props, attrs)
    const isDisabled = computed(() => group?.disabled.value || props.disabled)
    const isElevated = computed(() => {
      return props.variant === 'contained' && !(props.disabled || props.flat || props.border)
    })

    useSelectLink(link, group?.select)

    useRender(() => {
      const Tag = (link.isLink.value) ? 'a' : props.tag
      const hasColor = !group || group.isSelected.value

      return (
        <Tag
          type={ Tag === 'a' ? undefined : 'button' }
          class={[
            'v-btn',
            group?.selectedClass.value,
            {
              'v-btn--active': props.active,
              'v-btn--block': props.block,
              'v-btn--disabled': isDisabled.value,
              'v-btn--elevated': isElevated.value,
              'v-btn--flat': props.flat,
              'v-btn--icon': !!props.icon,
              'v-btn--stacked': props.stacked,
            },
            themeClasses.value,
            borderClasses.value,
            hasColor ? colorClasses.value : undefined,
            densityClasses.value,
            elevationClasses.value,
            positionClasses.value,
            roundedClasses.value,
            sizeClasses.value,
            variantClasses.value,
          ]}
          style={[
            hasColor ? colorStyles.value : undefined,
            dimensionStyles.value,
            locationStyles.value,
          ]}
          disabled={ isDisabled.value || undefined }
          href={ link.href.value }
          v-ripple={[
            !isDisabled.value && props.ripple,
            null,
            props.icon ? ['center'] : null,
          ]}
          onClick={ (e: MouseEvent) => {
            if (isDisabled.value) return

            link.navigate?.(e)
            group?.toggle()
          } }
        >
          { genOverlays(true, 'v-btn') }

          { !props.icon && props.prependIcon && (
            <VIcon
              class="v-btn__icon"
              icon={ props.prependIcon }
              start
            />
          ) }

          <div class="v-btn__content" data-no-activator="">
            { typeof props.icon === 'boolean'
              ? slots.default?.()
              : (
                <VIcon
                  class="v-btn__icon"
                  icon={ props.icon }
                  size={ props.size }
                />
              )
            }
          </div>

          { !props.icon && props.appendIcon && (
            <VIcon
              class="v-btn__icon"
              icon={ props.appendIcon }
              end
            />
          ) }
        </Tag>
      )
    })

    const expose = {}

    return group ? group.isReady.then(() => expose) : expose
  },
})

export type VBtn = InstanceType<typeof VBtn>
