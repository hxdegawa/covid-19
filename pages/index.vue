<template lang="pug">
  .top
    Logo
    main.inner-margin
      .top__dashboard
        .top__dashboard__wrapper
          .top__dashboard__wrapper__count-item.card.white-underline(data-title="Total Confirmed Countries")
            span {{numberWithCommas(totalConfirmedCountries)}}
            i.top__dashboard__wrapper__count-item__icon.material-icons(data-tooltip="合計感染国数") help_outline
          .top__dashboard__wrapper__count-item.card.yellow-underline(data-title="Total Confirmed Humans")
            span {{numberWithCommas(totalInfected)}}
            i.top__dashboard__wrapper__count-item__icon.material-icons(data-tooltip="合計感染者数") help_outline
          .top__dashboard__wrapper__count-item.card.red-underline(data-title="Total Deaths")
            span {{numberWithCommas(totalDeaths)}}
            i.top__dashboard__wrapper__count-item__icon.material-icons(data-tooltip="合計死者数") help_outline
          .top__dashboard__wrapper__count-item.card.green-underline(data-title="Total Recovered")
            span {{numberWithCommas(totalRecovered)}}
            i.top__dashboard__wrapper__count-item__icon.material-icons(data-tooltip="合計治癒数") help_outline
          .top__dashboard__wrapper__bar#bar
          .top__dashboard__wrapper__map#map
    
</template>

<script lang="ts">
import { Component, Model, Prop, Provide, Vue } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'

import Logo from '~/components/Logo.vue'
import { Country } from '~/lib/asyncData/countryInfo'
import { Coordinates } from '~/lib/asyncData/coordinateInfo'

interface AsyncData {
  summary: Country[]
  confirmedLocations: Coordinates[]
  totalInfected: number
  totalDeaths: number
  totalRecovered: number
  totalConfirmedCountries: number
}

@Component({
  layout: 'base',
  components: {
    Logo
  }
})
export default class IndexPage extends Vue {
  async asyncData({ app }: Context): Promise<AsyncData | void> {
    const summary: Country[] = await app.$axios.$get('/summary')
    const confirmedLocations: Coordinates[] = await app.$axios.$get(
      '/confirmedlocations'
    )
    const totalInfected: number = await app.$axios.$get('/totalinfected')
    const totalDeaths: number = await app.$axios.$get('/totaldeaths')
    const totalRecovered: number = await app.$axios.$get('/totalrecovered')
    const totalConfirmedCountries: number = await app.$axios.$get(
      '/totalinfectedcountries'
    )

    summary.shift()

    return {
      summary,
      totalInfected,
      totalDeaths,
      totalRecovered,
      totalConfirmedCountries,
      confirmedLocations
    }
  }
  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  mounted() {
    // console.log(JSON.stringify(this.confirmedLocations))

    let {
      am4core,
      am4maps,
      am4charts,
      am4geodata_worldLow,
      am4themes_animated
    } = this.$am4core()

    am4core.useTheme(am4themes_animated)
    // Themes end

    /**
     * Define SVG path for target icon
     */

    let targetSVG =
      'M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z'

    // Create map instance
    let chart = am4core.create('map', am4maps.MapChart)

    // Set map definition
    chart.geodata = am4geodata_worldLow

    // Set projection
    chart.projection = new am4maps.projections.Miller()

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries())

    // Exclude Antartica
    polygonSeries.exclude = ['AQ']

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template
    polygonTemplate.strokeOpacity = 0.5
    polygonTemplate.nonScalingStroke = false

    // create capital markers
    let imageSeries = chart.series.push(new am4maps.MapImageSeries())

    // define template
    let imageSeriesTemplate = imageSeries.mapImages.template
    let circle = imageSeriesTemplate.createChild(am4core.Sprite)
    circle.scale = 0.4
    circle.fill = new am4core.InterfaceColorSet().getFor(
      'alternativeBackground'
    )
    circle.path = targetSVG

    imageSeriesTemplate.propertyFields.latitude = 'latitude'
    imageSeriesTemplate.propertyFields.longitude = 'longitude'

    imageSeriesTemplate.horizontalCenter = 'middle'
    imageSeriesTemplate.verticalCenter = 'middle'
    imageSeriesTemplate.align = 'center'
    imageSeriesTemplate.valign = 'middle'
    imageSeriesTemplate.width = 8
    imageSeriesTemplate.height = 8
    imageSeriesTemplate.nonScaling = true
    imageSeriesTemplate.tooltipText = '{title}: {confirmed}'
    console.log(imageSeriesTemplate)
    imageSeriesTemplate.fill = am4core.color('#000')
    imageSeriesTemplate.background.fillOpacity = 0
    imageSeriesTemplate.background.fill = am4core.color('#ffffff')
    imageSeriesTemplate.setStateOnChildren = true
    imageSeriesTemplate.states.create('hover')

    imageSeries.data = this.confirmedLocations

    const confirmedRanking = this.confirmedLocations.sort(
      (a: Coordinates, b: Coordinates) => {
        return b.confirmed - a.confirmed
      }
    )

    let lolipop = am4core.create('bar', am4charts.XYChart)

    lolipop.data = confirmedRanking.slice(0, 10)
    let categoryAxis = lolipop.xAxes.push(new am4charts.CategoryAxis())
    categoryAxis.renderer.grid.template.location = 0
    categoryAxis.dataFields.category = 'title'
    categoryAxis.renderer.minGridDistance = 15
    categoryAxis.renderer.grid.template.stroke = am4core.color('#fff')
    categoryAxis.renderer.grid.template.location = 0.5
    categoryAxis.renderer.grid.template.strokeDasharray = '1,3'
    categoryAxis.renderer.labels.template.disabled = true

    categoryAxis.renderer.labels.template.adapter.add('dx', function(
      dx: any,
      target: any
    ) {
      return -target.maxRight / 2
    })

    let valueAxis = lolipop.yAxes.push(new am4charts.ValueAxis())
    valueAxis.tooltip.disabled = true
    valueAxis.renderer.ticks.template.disabled = true
    valueAxis.renderer.axisFills.template.disabled = true
    valueAxis.renderer.labels.template.disabled = true

    let series = lolipop.series.push(new am4charts.ColumnSeries())
    series.dataFields.categoryX = 'title'
    series.dataFields.valueY = 'confirmed'
    console.log(series.dataFields)
    series.sequencedInterpolation = true
    series.fillOpacity = 0
    series.strokeOpacity = 0
    series.strokeDashArray = '1,3'
    series.columns.template.width = 0.02
    series.stroke = am4core.color('#fff')
    series.tooltipText = '{valueY.value}'
    series.tooltip.pointerOrientation = 'horizontal'
    series.tooltip.fontFamily = 'Inter'
    series.tooltip.getFillFromObject = false
    series.tooltip.background.fill = am4core.color('#000000')
    series.tooltip.fill = am4core.color('#ffffff')
    series.tooltip.label.fill = am4core.color('#ffffff')

    let bullet = series.bullets.create(am4charts.CircleBullet)

    bullet.fill = am4core.color('#fff')
    bullet.stroke = am4core.color('#fff')
    bullet.scale = 0.4

    lolipop.cursor = new am4charts.XYCursor()
  }
}
</script>

<style lang="scss">
.top {
  &__dashboard {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    min-height: calc(var(--vh, 1vh) * 100);

    &__wrapper {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 30px;
      padding: 20px;

      @media screen and (max-width: $pc) {
        grid-template-columns: repeat(1, 1fr);
        grid-gap: 50px;
      }

      &__count-item {
        position: relative;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        padding: 20px;
        color: $color-white;

        &__icon {
          position: absolute;
          right: 15px;
          top: 15px;
          font-size: 18px;
          color: $color-darkgray;
          transition: color 0.2s ease;

          &:hover {
            color: $color-lightgray;
          }
        }

        span {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 60%;
        }

        &:before {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          content: attr(data-title);
          vertical-align: top;
          height: 100%;
          line-height: 18px;
          font-size: 11px;
          width: 40%;
        }
      }

      &__map {
        grid-column: 2 / 5;
        height: 500px;

        @media screen and (max-width: $pc) {
          grid-column: unset;
          height: auto;
        }
      }
    }
  }
}
</style>
