.class public final La21;
.super Ldr;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"


# direct methods
.method public synthetic constructor <init>(I)V
    .locals 0

    .line 18
    sget-object p1, Lcr;->b:Lcr;

    invoke-direct {p0, p1}, La21;-><init>(Ldr;)V

    return-void
.end method

.method public constructor <init>(Ldr;)V
    .locals 0

    .line 1
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 2
    .line 3
    .line 4
    iget-object p1, p1, Ldr;->a:Ljava/util/LinkedHashMap;

    .line 5
    .line 6
    invoke-virtual {p1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    .line 7
    .line 8
    .line 9
    invoke-direct {p0}, Ldr;-><init>()V

    .line 10
    .line 11
    .line 12
    iget-object p0, p0, Ldr;->a:Ljava/util/LinkedHashMap;

    .line 13
    .line 14
    invoke-interface {p0, p1}, Ljava/util/Map;->putAll(Ljava/util/Map;)V

    .line 15
    .line 16
    .line 17
    return-void
.end method
